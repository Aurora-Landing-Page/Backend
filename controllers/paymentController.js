// Library Imports
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto")

// User Imports
const { NotFoundError, UserError, ServerError } = require("../utils/errors");
const SuccessResponse = require("../utils/successResponses");
const successHandler = require("./successController");
const { payments, timeouts } = require("../utils/constants");
const eventController = require("./eventController");

// Model Imports
const { User, Group } = require("../models/userModel");
const Event = require("../models/event");
const Receipt = require("../models/paymentReceipt");

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

// Create Razorpay Instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (fee, data) => {
  // Testing pending
  const { type, ticketCode } = data;
  const receiptId = `aurora-${ type }-${ ticketCode }`

  try {
    const orderDetails = await razorpayInstance.orders.create({
      amount: fee * 100, // In paise
      currency: "INR",
      receipt: receiptId // Use the ticketCode of the userDoc as the receipt number
    });

    const receiptDoc = new Receipt({type, orderId: orderDetails.id, receiptId, ticketCode, data})
    await receiptDoc.save();
    return orderDetails;
  } catch (error) {
    console.error(`Error creating order: ${error}`);
    throw error;
  }
};

const sendKey = asyncHandler(async (req, res, next) => {
    const key = process.env.RAZORPAY_ID;
    successHandler(new SuccessResponse("Razorpay key retrieval successful"), res, { key })
})

const createPurchaseIntent = asyncHandler(async (req, res, next) => {
  // First three fields are exclusively for participation in events
  // members field is common in participation as well as ticket purchases (in case of group purchases)
  // Fields after members are exclusively for ticket purchasing

  const { eventId, eventType, groupName, members, accomodation, pronite, whole_event, purchaseType } = req.body;
  const token = req.cookies.jwt;
  let number = 1;
  let id;

  // Request validation
  if ((!eventId && !eventType) && (!accomodation && !pronite && !whole_event)) { 
    next(new UserError("Malformed request")); 
    return; 
  } 
  
  // Append the user themselves to the members array
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) { next(new UserError("Invalid JWT", 403)) } 
    else { id = decoded.id }
  });
  
  const userDoc = await User.findById(id);
  const ticketCode = userDoc._doc.ticketCode;
  members.push({ name: userDoc._doc.name, email: userDoc._doc.email, phone: userDoc._doc.phone });
  number = members.length;

  if (purchaseType == "group") {
    // Possible purchase sizes are 1, 5 (4 + 1) and 11 (8 + 3)
    number = members.length;
    const sizeOfGroup = number == 1 || number == 5 || number == 11;
    if (!sizeOfGroup) { next(new UserError("Malformed request")); return; }

    if (number > 1 && !members) {
      next(new UserError("Members not specified"));
      return;
    };
  }

  if (members) {
    members.forEach((member) => {
        member.phone = Number(member.phone);
        if (!member.name || !member.email || !member.phone) {
          next(new UserError("Invalid members array, all fields are necessary!"));
          return;
        } else { return }
    })
  }

  // Handle ticket purchases
  if (accomodation || pronite || whole_event) {
    // payable is later used to compute fee
    let payable;
    if (number == 1) { payable = 1 }
    if (number == 5) { payable = 4 }
    if (number == 11) { payable = 8 }
    const dt = new Date().toISOString();

    let fee;
    let purchasedTickets;

    const paymentRanges = {
        pronite: [
        { range: [timeouts.base, timeouts.day_zero], feeKey: `day_zero_pronite`, tickets: [true, true, true, false, false, false] },
        { range: [timeouts.day_zero, timeouts.day_one], feeKey: `day_one_pronite`, tickets: [true, true, true, false, false, false] },
        { range: [timeouts.day_one, timeouts.day_two], feeKey: `day_two_pronite`, tickets: [false, true, true, false, false, false] },
        { range: [timeouts.day_two, timeouts.day_three], feeKey: `day_three_pronite`, tickets: [false, false, true, false, false, false] }
        ],
        whole_event: [
        { range: [timeouts.base, timeouts.day_zero], feeKey: `day_zero_whole_event`, tickets: [true, true, true, true, true, true] },
        { range: [timeouts.day_zero, timeouts.day_one], feeKey: `day_one_whole_event`, tickets: [true, true, true, true, true, true] },
        { range: [timeouts.day_one, timeouts.day_two], feeKey: `day_two_whole_event`, tickets: [false, true, true, false, true, true] },
        { range: [timeouts.day_two, timeouts.day_three], feeKey: `day_three_whole_event`, tickets: [false, false, true, false, false, true] }
        ],
    };

    const event = pronite ? "pronite" : "whole_event";
    for (let range of paymentRanges[event]) {
        if (dt >= range.range[0] && dt < range.range[1]) {
            fee = payable * payments[range.feeKey];
            fee += accomodation == true ? payments.accomodation : 0;
            purchasedTickets = range.tickets;
            break;
        }
    }

    const type = number == 1 ? "purchase_individual" : "purchase_group"
    const data = { type, accomodation, ticketCode, purchasedTickets, members }
    try {
        const order = await createOrder(fee, data);
        successHandler(new SuccessResponse("Purchase Intent Received"), res, order);
    } catch (error) {
        console.error(error)
        next(new ServerError("Purchase intent could not be created"));
    }
  } 
  // Handle event participations
  else if (eventId) {
    const eventDoc = await Event.findById(eventId);
    const fee = eventDoc._doc.fee;

    if (!eventDoc) { next(new NotFoundError("Invalid event ID")); return; }

    if (eventType == "group") {
        if (!eventDoc._doc.isGroup) { next(new UserError("Malformed request")); return; }

        const data = { type: "participate_group", groupName, ticketCode, members, eventId }
        try {
            const order = await createOrder(fee, data);
            successHandler(new SuccessResponse("Purchase Intent Received"), res, order);
        } catch (error) {
            console.error(error)
            next(new ServerError("Purchase intent could not be created"));
        }
    } else if (eventType == "individual") {
        if (eventDoc._doc.isGroup) { next(new UserError("Malformed request")); return; }

        const data = { type: "participate_individual", ticketCode, eventId }
        try {
            const order = await createOrder(fee, data);
            successHandler(new SuccessResponse("Purchase Intent Received"), res, order);
        } catch (error) {
            console.error(error)
            next(new ServerError("Purchase intent could not be created"));
        }
    } else { next(new UserError("Invalid event type")) }
  }
  }
);

const verifyPurchase = asyncHandler(async (req, res, next) => {
  // Testing pending
  // Additionally uses the Razorpay and crypto libraries

  const { razorpaySignature, razorpayOrderId, razorpayPaymentId } = req.body;
  const key_secret = process.env.RAZORPAY_SECRET;

  if (!razorpaySignature || !razorpayOrderId || !razorpayPaymentId) {
    next(new UserError("Malformed request"));
  } else {
    // Implementation pending, would look something like this:
    // Works by comparing the signature received from user to the hash generated using payment_id and order_id

    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest("hex");

    // Verify the signature and perform post payment methods
    try {
      if (razorpaySignature === generatedSignature) {
        const receiptDoc = await Receipt.findOne({ orderId: razorpayOrderId });
        receiptDoc.paymentId = razorpayPaymentId;

        const { data } = receiptDoc._doc;
        const ticketCode = receiptDoc._doc.ticketCode;
        const userDoc = await User.findOne({ ticketCode });
        userDoc.associatedPayments.push(receiptDoc.receiptId);
        receiptDoc.verified = true;

        if (data.type == "purchase_individual") {
            userDoc.purchasedTickets = data.purchasedTickets;
            await eventController.sendQR(userDoc._doc.email, userDoc._doc.name, userDoc._doc.ticketCode)
        } else if (data.type == "purchase_group") {
            userDoc.purchasedTickets = data.purchasedTickets;
            userDoc.groupPurchase = data.members;

            await eventController.sendQR(userDoc._doc.email, userDoc._doc.name, userDoc._doc.ticketCode);
            data.members.forEach(async (member) => {
                await eventController.sendQR(member.email, member.name, userDoc._doc.ticketCode);
            });
        } else if (data.type == "participate_individual") {
            const eventDoc = await Event.findById(data.eventId);
            const userObjId = new mongoose.Types.ObjectId(userDoc._doc._id);

            eventDoc.participants.push(userObjId);
            userDoc.participatedIndividual.push(eventObjId);

            await eventController.sendQR(userDoc._doc.email, userDoc._doc.name, userDoc._doc.ticketCode);
            await eventDoc.save();
        } else if (data.type == "participate_group") {
            const eventDoc = await Event.findById(data.eventId);
            const userObjId = new mongoose.Types.ObjectId(userDoc._doc._id);

            if (!userDoc.participatedGroup) { userDoc.participatedGroup = new Map(); }
            eventDoc.participants.push(userObjId);

            const groupInstance = new Group({ groupName: data.groupName, members: data.members });
            userDoc.participatedGroup.set(data.eventId, groupInstance);
            userDoc.markModified("participatedGroup");

            await eventController.sendQR(userDoc._doc.email, userDoc._doc.name, userDoc._doc.ticketCode);
            data.members.forEach(async (member) => {
                await eventController.sendQR(member.email, member.name, userDoc._doc.ticketCode);
            });
            await eventDoc.save();
        }

        await userDoc.save();
        await receiptDoc.save();
        successHandler(new SuccessResponse("Payment has been verified!"), res, { success: true });
      } else {
        next(new UserError("Payment could not be verified"));
      }
    } catch (error) {
        console.error(error)
        next(new ServerError("Payment could not be processed"));
    }
  }
});

module.exports = {
    sendKey,
    createPurchaseIntent,
    verifyPurchase,
};
