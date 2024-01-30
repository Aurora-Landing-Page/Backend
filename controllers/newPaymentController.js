// Library Imports
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Jimp = require('jimp');

// User Imports
const { NotFoundError, UserError, ServerError } = require("../utils/errors");
const SuccessResponse = require("../utils/successResponses");
const successHandler = require("./successController");
const { payments, timeouts } = require("../utils/constants");
const userController = require("./userController");
const eventController = require("./eventController");
const emailController = require("./emailController");

// Model Imports
const { User, Group } = require("../models/userModel");
const Event = require("../models/event");

// Import environment variables
const dotenv = require("dotenv");
const ManualPayment = require("../models/manualPayment");
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const createOrder = async (fee, data, req) => {
  // Testing pending
  const { type, ticketCode } = data;
  let code = userController.generateCode(8);
  let receiptId = `aurora-${ type }-${ code }`;
  const checkReceiptId = await ManualPayment.findOne({ receiptId });

  while (checkReceiptId) { 
    code = userController.generateCode(8);
    receiptId = `aurora-${ type }-${ code }`;
  }

  try {
    const receiptDoc = new ManualPayment({receiptId, ticketCode, data, amount: fee, approved: false})
    await receiptDoc.save();
    return receiptDoc;
  } catch (error) {
    console.error(`Error creating order: ${error}`);
    throw error;
  }
};

const uploadScreenshot = asyncHandler(async(req, res, next) => {
    const { receiptId } = req.body;
    try {
      if (req.file.size > (1024 * 1024) + 1000) {
        next(new UserError("File size too large", 413));
        return;
      }
      
      const receiptDoc = await ManualPayment.findOne({ receiptId });
      if (receiptDoc) {
          const uploadStream = cloudinary.uploader.upload_stream({ resource_type: "image" }, async (err, result) => {
              if (err) {
                  console.error(err);
                  throw err;
              }
  
              receiptDoc.imageUrl = result.secure_url;
              await receiptDoc.save();
              successHandler(new SuccessResponse("File uploaded successfully"), res, { success: true });
          });
  
          await streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
      } else {
          next(new NotFoundError("Specified receiptId could not be found"))
      }
    } catch (error) {
        console.error(error);
        next(new ServerError("File could not be uploaded"));
    }
})

const createPurchaseIntent = asyncHandler(async (req, res, next) => {
  // First three fields are exclusively for participation in events
  // members field is common in participation as well as ticket purchases (in case of group purchases)
  // Fields after members are exclusively for ticket purchasing

  const { eventId, eventType, groupName, accomodation, pronite, whole_event, purchaseType } = req.body;
  var { members } = req.body;
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
  if (members) {
    members.push({ name: userDoc._doc.name, email: userDoc._doc.email, phone: userDoc._doc.phone });
  } else {
    members = [{ name: userDoc._doc.name, email: userDoc._doc.email, phone: userDoc._doc.phone }];
  }
  number = members.length;

  if (purchaseType == "group") {
    // Possible purchase sizes are 1, 5 (4 + 1) and 11 (8 + 3)
    number = members.length;

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
    let payable = number;
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
            fee += accomodation == true ? payments.accomodation * payable : 0;
            purchasedTickets = range.tickets;
            break;
        }
    }

    const type = number == 1 ? "purchase_individual" : "purchase_group"
    const data = { type, accomodation, ticketCode, purchasedTickets, members }
    try {
        const order = await createOrder(fee, data, req);
        const receiptId = order.receiptId; 
        data.members.forEach(async (member) => {
            await eventController.sendQR(member.name, member.email, member.phone, userDoc._doc.ticketCode, receiptId);
        });
        successHandler(new SuccessResponse("Purchase Intent Received"), res, order._doc);
    } catch (error) {
        console.error(error)
        next(new ServerError("Purchase intent could not be created"));
    }
  } 
  // Handle event participations
  else if (eventId) {
    let payable = number;
    const eventDoc = await Event.findById(eventId);
    const fee = payable * eventDoc._doc.fee;

    if (!eventDoc) { next(new NotFoundError("Invalid event ID")); return; }

    if (eventType == "group") {
        if (!eventDoc._doc.isGroup) { next(new UserError("Malformed request")); return; }

        const data = { type: "participate_group", groupName, ticketCode, members, eventId }
        try {
            const order = await createOrder(fee, data, req);
            const receiptId = order.receiptId;
            data.members.forEach(async (member) => {
                await eventController.sendQR(member.name, member.email, member.phone, userDoc._doc.ticketCode, receiptId);
            });
            successHandler(new SuccessResponse("Purchase Intent Received"), res, order._doc);
        } catch (error) {
            console.error(error)
            next(new ServerError("Purchase intent could not be created"));
        }
    } else if (eventType == "individual") {
        if (eventDoc._doc.isGroup) { next(new UserError("Malformed request")); return; }

        const data = { type: "participate_individual", ticketCode, eventId }
        try {
            const order = await createOrder(fee, data, req);
            const receiptId = order.receiptId;
            await eventController.sendQR(userDoc._doc.name, userDoc._doc.email, userDoc._doc.phone, userDoc._doc.ticketCode, receiptId);
            successHandler(new SuccessResponse("Purchase Intent Received"), res, order._doc);
        } catch (error) {
            console.error(error)
            next(new ServerError("Purchase intent could not be created"));
        }
    } else { next(new UserError("Invalid event type")) }
  }
  }
);

const approvePurchase = asyncHandler(async (req, res, next) => {
    try {
        const { receiptId } = req.query;
        const receiptDoc = await ManualPayment.findOne({ receiptId });
        
        if (!receiptDoc) {
          next(new NotFoundError("Specified receiptId could not be found"));
          return;
        }

        const { data } = receiptDoc._doc;
        const ticketCode = receiptDoc._doc.ticketCode;
        const userDoc = await User.findOne({ ticketCode });
        userDoc.associatedPayments.push(receiptDoc.receiptId);
        receiptDoc.approved = true;
    
        if (data.type == "purchase_individual") {
            userDoc.purchasedTickets = data.purchasedTickets;
            const { name, email, phone } = userDoc._doc;
            const ticketImage = await userController.generateTicket(name, email, phone, ticketCode)
            const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
            await emailController.sendConfirmation(name, email, buffer, userDoc._doc.ticketCode, receiptId);
        } else if (data.type == "purchase_group") {
            userDoc.purchasedTickets = data.purchasedTickets;
            userDoc.groupPurchase = data.members;
    
            data.members.forEach(async (member) => {
                const { name, email, phone } = member;
                const ticketImage = await userController.generateTicket(name, email, phone, ticketCode)
                const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
                await emailController.sendConfirmation(name, email, buffer, userDoc._doc.ticketCode, receiptId);
            });
        } else if (data.type == "participate_individual") {
            const eventDoc = await Event.findById(data.eventId);
            const eventObjId = new mongoose.Types.ObjectId(eventDoc._doc._id);
            const userObjId = new mongoose.Types.ObjectId(userDoc._doc._id);
    
            eventDoc.participants.push(userObjId);
            userDoc.participatedIndividual.push(eventObjId);
    
            const { name, email, phone } = userDoc._doc;
            const ticketImage = await userController.generateTicket(name, email, phone, ticketCode)
            const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
            await emailController.sendEventConfirmation(name, email, buffer, userDoc._doc.ticketCode, eventDoc._doc.name, receiptId);
            await eventDoc.save();
        } else if (data.type == "participate_group") {
            const eventDoc = await Event.findById(data.eventId);
            const eventObjId = new mongoose.Types.ObjectId(eventDoc._doc._id);
            const userObjId = new mongoose.Types.ObjectId(userDoc._doc._id);
    
            if (!userDoc.participatedGroup) { userDoc.participatedGroup = new Map(); }
            eventDoc.participants.push(userObjId);
    
            const groupInstance = new Group({ groupName: data.groupName, members: data.members });
            userDoc.participatedGroup.set(data.eventId, groupInstance);
            userDoc.markModified("participatedGroup");
    
            data.members.forEach(async (member) => {
                const { name, email, phone } = member;
                const ticketImage = await userController.generateTicket(name, email, phone, ticketCode)
                const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
                await emailController.sendEventConfirmation(name, email, buffer, userDoc._doc.ticketCode, eventDoc._doc.name, receiptId);
            });
            await eventDoc.save();
        }
    
        await userDoc.save();
        await receiptDoc.save();
        successHandler(new SuccessResponse("Payment has been approved!"), res, { success: true });
    } catch (error) {
        console.error(error);
        next(new ServerError("Payment could not be approved!"))
    }
});

const getReceipt = asyncHandler(async(req, res, next) => {
    const { receiptId } = req.query
  
    if (!receiptId) {
      next(new UserError("Invalid query"))
    } else {
      try {
        const receiptDoc = await ManualPayment.findOne({ receiptId })
        const {_id, ...otherFields} = receiptDoc._doc
        if (receiptDoc) {
          successHandler(new SuccessResponse("User Found!"), res, otherFields)
        } else {
          next(new NotFoundError("Receipt ID could not be found"))
        }
      } catch (error) {
        console.error(error)
        next(new ServerError("Receipt ID could not be resolved"))
      }
    }
})

const getAllUnapprovedReceipts = asyncHandler(async(req, res, next) => {
    try {
        const receipts = await ManualPayment.find({ approved: false });
        successHandler(new SuccessResponse("Query successful"), res, { unapprovedPayments: receipts });
    } catch (error) {
        console.error(error);
        next(new ServerError("Query could not be ececuted"));
    }
})

module.exports = {
    uploadScreenshot,
    createPurchaseIntent,
    approvePurchase,
    getReceipt,
    getAllUnapprovedReceipts
};
