// Library Imports
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const qrcode = require("qrcode");
const Razorpay = require("razorpay")

// User Imports
const {NotFoundError, UserError, ServerError} = require("../utils/errors")
const SuccessResponse = require("../utils/successResponses")
const successHandler = require("./successController")
const { payments, timeouts } = require("../utils/constants")
const { AdminAddedUser } = require("../models/adminAdded")
const userController = require("./userController")
const emailController = require("./emailController")

// Model Imports
const { User, Group } = require("../models/userModel");
const CA = require("../models/caModel");
const event = require("../models/event")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

// Create Razorpay Instance
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_ID,
//   key_secret: process.env.RAZORPAY_SECRET
// });

const sendQR = async(email, name, ticketCode) => {
  try {
    const toEncode = process.env.SITE + "/verify?ticketCode=" + ticketCode

    qrcode.toDataURL(toEncode, async (err, url) => {
      if (err) {
        console.error(error)
        throw new Error(error)
      } else {
        await emailController.sendQRMail(email, name, url)
      }
    })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

const confirmParticipationPayment = async(userId, eventDoc, members) => {
  if (members) {
    // Group Event handling
    // const fee = members.length * eventDoc.fee
    return true
  } 
  else {
    // Individual Event Handling
    // const fee = eventDoc.fee
    return true
  }
}

const createPayment = async(userDoc, fee, purchasedTickets, accomodation, members) => {
  // Testing pending
  
  // try {
  //   const orderDetails = await razorpayInstance.orders.create({
  //     amount: fee * 100, // In paise
  //     currency: 'INR',
  //     receipt: String(userDoc._doc.ticketCode), // Use the ticketCode of the userDoc as the receipt number
  //     notes: { purchasedTickets, accomodation, members }
  //   });
  
  //   return orderDetails;
  // } catch (error) {
  //   console.error(`Error creating order: ${error}`);
  //   throw error;
  // }
  return true;
}

const createPurchaseIntent = asyncHandler(async (req, res, next) => {
  const { event, accomodation, number, members, referralCode } = req.body;
  const token = req.cookies.jwt;
  let id;

  // Possible purchase sizes are 1, 5 (4 + 1) and 11 (8 + 3)
  const sizeOfGroup = number != 1 && number != 5 || number != 11
  const eventType = event == "pronite" || event == "whole_event"

  if (!event || !number || sizeOfGroup || !accomodation || !eventType) { next(new UserError("Malformed request")) }
  else {
    if (number > 1 && !members) { next(new UserError("Members not specified")) }
    else {
      members.forEach((member) => {
        if (!member.name || !member.email || !member.phone) { next(new UserError("Invalid members array, all fields are necessary!")) }
        else { return; }
      })

      // payable is later used to compute fee
      let payable;
      if (number == 1) { payable = 1 }
      if (number == 5) { payable = 4 }
      if (number == 11) { payable = 8 }

      let id;
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { next(new UserError("Invalid JWT", 403)) } 
        else { id = decoded.id }
      })
  
      const userDoc = await User.findById(id)
      const dt = new Date().toISOString();
      const pronite_ticket = [true, false]
      const whole_event_ticket = [true, true]
      
      let fee;
      let purchasedTickets;

      const paymentRanges = {
      pronite: [
        { range: [timeouts.base, timeouts.day_zero], feeKey: `day_zero_pronite`, tickets: pronite_ticket },
        { range: [timeouts.day_zero, timeouts.day_one], feeKey: `day_one_pronite`, tickets: pronite_ticket },
        { range: [timeouts.day_one, timeouts.day_two], feeKey: `day_two_pronite`, tickets: pronite_ticket },
        { range: [timeouts.day_two, Infinity], feeKey: `day_three_pronite`, tickets: pronite_ticket }
      ],
      whole_event: [
        { range: [timeouts.base, timeouts.day_zero], feeKey: `day_zero_whole_event`, tickets: whole_event_ticket },
        { range: [timeouts.day_zero, timeouts.day_one], feeKey: `day_one_whole_event`, tickets: whole_event_ticket },
        { range: [timeouts.day_one, timeouts.day_two], feeKey: `day_two_whole_event`, tickets: whole_event_ticket },
        { range: [timeouts.day_two, Infinity], feeKey: `day_three_whole_event`, tickets: whole_event_ticket }
      ]
      };
      
      for (let range of paymentRanges[event]) {
        if (dt >= range.range[0] && dt < range.range[1]) {
          fee = payable * payments[range.feeKey];
          fee += accomodation == true ? payments.accomodation : 0;
          purchasedTickets = range.tickets;
          break;
        }
      }

      try {
        const order = await createPayment(userDoc, fee, purchasedTickets, accomodation, members);
        successHandler(new SuccessResponse("Purchase Intent Received"), res, order)        
      } catch (error) {
        next(new ServerError("Purchase Intent could not be created"))
      }
    }
  }
})

const verifyPurchase = asyncHandler(async (req, res, next) => {
  // Testing pending
  // Additionally uses the Razorpay and crypto libraries
  
  const { razorpay_signature, razorpay_order_id, razorpay_payment_id } = req.body
  const key_secret = process.env.RAZORPAY_SECRET

  if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) { next(new UserError("Malformed request")) }
  else {
    // Implementation pending, would look something like this:
    // Works by comparing the signature received from user to the hash generated using payment_id and order_id
    
    let hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
  
    // Verify the signature
    try {
      if (razorpay_signature === generated_signature) {
        const order = await razorpayInstance.orders.fetch(orderId);
        const ticketCode = razorpay_order_id
        const userDoc = await User.findOne({ ticketCode })
    
        userDoc._doc.purchasedTickets = order.notes.purchasedTickets
        userDoc._doc.accomodation = order.notes.accomodation
        userDoc._doc.groupPurchase = order.notes.members
    
        await userDoc.save()
        await sendQR(userDoc._doc.email, userDoc._doc.name, userDoc._doc.ticketCode)
        successHandler(new SuccessResponse("Payment has been verified!"), res)
      } else {
        next(new UserError("Payment could not be verified"))
      }
    } catch (error) {
      next(new ServerError("Payment could not be processed"))
    }
  }

})

const addIndividual = asyncHandler(async (req, res, next) => {
  const { eventId, name } = req.body;
  let { email, phone } = req.body;
  const token = req.cookies.jwt

  if (!eventId || !name) { next(new UserError("eventId and name are required fields!")) }
  else {
    const eventDoc = await event.findById(eventId)
    
    if (eventDoc.isGroup) {
      next(new UserError("Malformed request")) 
    }
    else {
      let id;
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { next(new UserError("Invalid JWT", 403)) } 
        else { id = decoded.id }
      })

      const userDoc = await User.findById(id)

      if (!email) { email = userDoc.email }
      if (!phone) { phone = userDoc.phone }
      
      const newUser = new AdminAddedUser({ name, email, phone })
      const userObjId = new mongoose.Types.ObjectId(newUser.id)
      const eventObjId = new mongoose.Types.ObjectId(eventId)

      try {
        eventDoc.participants.push(userObjId)
        newUser.participatedIndividual.push(eventObjId)

        await eventDoc.save()
        await newUser.save()
        successHandler(new SuccessResponse("Participation confirmed in event"), res)
      } catch (error) {
        console.error(error)
        next(new ServerError("Details could not be saved"))
      }
    }
  }
})

const addGroup = asyncHandler(async (req, res, next) => {
  const { eventId, groupName, members } = req.body
  let { email, phone } = req.body
  const token = req.cookies.jwt
  
  members.forEach((member) => {
    if (!member.name) { next(new UserError("Invalid members array, name field is necessary!")) }
    else { return; }
  })

  if (!eventId || !groupName || !members) { next(new UserError("eventId, grouName and members are required fields!")) }
  else {
    const eventDoc = await event.findById(eventId)
    
    if (!eventDoc.isGroup) {
      next(new UserError("Malformed request")) 
    }
    else {
      let id;
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { next(new UserError("Invalid JWT", 403)) } 
        else { id = decoded.id }
      })

      const userDoc = await User.findById(id)

      if (!email) { email = userDoc.email }
      if (!phone) { phone = userDoc.phone }

      members.forEach((member) => {
        if (!member.email || member.phone) { member.email = userDoc.email; member.phone = userDoc.phone }
        else { return; }
      })
      
      const newUser = new AdminAddedUser({ name: groupName, email, phone })
      const userObjId = new mongoose.Types.ObjectId(newUser.id)

      try {
        if (!newUser.participatedGroup) {
          newUser.participatedGroup = new Map();
        }

        eventDoc.participants.push(userObjId)

        const groupInstance = new Group({ groupName, members })
        newUser.participatedGroup.set(eventId, groupInstance)
        newUser.markModified("participatedGroup")

        await eventDoc.save()
        await newUser.save()
        successHandler(new SuccessResponse("Participation confirmed in event"), res)
      } catch (error) {
        console.error(error)
        next(new ServerError("Details could not be saved"))
      }
    }
  }
})

const participateIndividual = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const token = req.cookies.jwt;
  let id;

  if (!eventId) { next(new UserError("Malformed request!")) }
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) { next(new UserError("Invalid JWT", 403)) } 
      else { id = decoded.id }
    })
    
    const userDoc = await User.findById(id)
    const eventDoc = await event.findById(eventId)

    if (eventDoc) {
      if (eventDoc.isGroup) {
        next(new UserError("Malformed request"))
      } else {
        const userObjId = new mongoose.Types.ObjectId(id)
        const eventObjId = new mongoose.Types.ObjectId(eventId)

        const alreadyParticipated = userDoc.participatedIndividual.some((id) => {
          return id.equals(eventObjId)
        })

        if (alreadyParticipated) {
          next(new UserError("Already participated in this event!", 409))
        } else {
          // Defaults to true for now as confirmParticipationPayment has not been implemented
          const paid = await confirmParticipationPayment(id, eventDoc) || true;
  
          if (paid) {
            try {
              eventDoc.participants.push(userObjId)
              userDoc.participatedIndividual.push(eventObjId)

              await eventDoc.save()
              await userDoc.save()
              successHandler(new SuccessResponse("Participation confirmed in event"), res)
            } catch (error) {
              console.error(error)
              next(new ServerError("Details could not be saved"))
            }
          } else { next(new UserError("Payment could not be confirmed", 402)) }
        }
      }
    } else { next(new UserError("Invalid event ID")) }
  }
})

const participateGroup = asyncHandler(async (req, res, next) => {
  const { eventId, groupName, members } = req.body;
  const token = req.cookies.jwt;
  let id;
  
  members.forEach((member) => {
    if (!member.name || !member.email || !member.phone) { next(new UserError("Invalid members array, all fields are necessary!")) }
    else { return; }
  })

  if (!eventId || !groupName || !members) { next(new UserError("Malformed request!")) }
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) { next(new UserError("Invalid JWT", 403)) }
      else { id = decoded.id }
    })

    const userDoc = await User.findById(id)
    const eventDoc = await event.findById(eventId)
    if (eventDoc) {
      if (!eventDoc.isGroup) {
        next(new UserError("Malformed request"))
      } else {
        const userObjId = new mongoose.Types.ObjectId(id)
        
        if (userDoc.participatedGroup.has(eventId)) {
          next(new UserError("Already participated in this event!", 409))
        } else {
          // Defaults to true for now as confirmParticipationPayment has not been implemented
          const paid = await confirmParticipationPayment(id, eventDoc) || true;
  
          if (paid) {
            try {
              if (!userDoc.participatedGroup) {
                userDoc.participatedGroup = new Map();
              }
  
              eventDoc.participants.push(userObjId)

              const groupInstance = new Group({ groupName, members })
              userDoc.participatedGroup.set(eventId, groupInstance)
              userDoc.markModified("participatedGroup")
  
              await eventDoc.save()
              await userDoc.save()
              successHandler(new SuccessResponse("Participation confirmed in event"), res)
            } catch (error) {
              console.error(error)
              next(new ServerError("Details could not be saved"))
            }
          } else { next(new UserError("Payment could not be confirmed", 402)) }
        }
      }
    } else { next(new UserError("Invalid event ID")) }
  }
})

const getParticipants = asyncHandler(async (req, res, next) => {
    const { eventId, type } = req.body
    
    if (type != "individual" && type != "group") { next(new UserError("Invalid event type")) }
    else {
        if (mongoose.isValidObjectId(eventId)) {
          const eventDoc = await event.findById(eventId)
        
          if (eventDoc) {
            if (type === "individual") {
              event.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
                {
                  $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participant_1"
                  }
                },
                {
                  $lookup: {
                    from: "admin_added_users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participant_2"
                  }
                },
                {
                  $addFields: {
                    participant: {
                      $concatArrays: ["$participant_1", "$participant_2"]
                    }
                  }
                },
                {
                  $project: {
                    participant_1: 0,
                    participant_2: 0
                  }
                },
                { $unwind: "$participant" },
                {
                  $project: {
                    _id: "$participant._id",
                    name: "$participant.name",
                    email: "$participant.email",
                    phone: "$participant.phone"
                  }
                }
                ])
                .exec()
                .then(obj => {
                  successHandler(new SuccessResponse("DB Query Successful"), res, { participants: obj })
                })
                .catch(err => {
                  console.error(err)
                  next(new ServerError(err.message))
                })               
            } else {
              event.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
                {
                  $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "leader_1"
                  }
                },
                {
                  $lookup: {
                    from: "admin_added_users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "leader_2"
                  }
                },
                {
                  $addFields: {
                    leader: {
                      $concatArrays: ["$leader_1", "$leader_2"]
                    }
                  }
                },
                {
                  $project: {
                    leader_1: 0,
                    leader_2: 0
                  }
                },
                { $unwind: "$leader" },
                {
                  $project: {
                    _id: "$leader._id",
                    name: "$leader.name",
                    email: "$leader.email",
                    phone: "$leader.phone",
                    group: `$leader.participatedGroup.${ eventId }`
                  }
                }
            ])
            .exec()
            .then(obj => {
              successHandler(new SuccessResponse("DB Query Successful"), res, { leaders: obj })
            })
            .catch(err => {
              console.error(err)
              next(new ServerError(err.message))
            })   
          }
        } else { next(new NotFoundError("The specified eventId could not be found")) }
      } else { next(new UserError("Invalid eventId provided")) }
    }
})

const verify = asyncHandler(async(req, res, next) => {
  const { ticketCode } = req.query

  if (!ticketCode) {
    next(new UserError("Invalid query"))
  } else {
    try {
      const userDoc = await User.findOne({ ticketCode })
      if (userDoc) {
        const {password, __v, createdAt, updatedAt, _id, ...otherFields} = userDoc._doc;
        successHandler(new SuccessResponse("User Found!"), res, otherFields)
      } else {
        next(new NotFoundError("User with corresponding ticket code could not be found"))
      }
    } catch (error) {
      next(new ServerError("Ticket could not be verified"))
    }
  }
})

const hasAttended = asyncHandler(async(req, res, next) => {
  const { ticketCode, event } = req.body
  const eventName = event == "pronite" || event == "whole_event"

  if (!ticketCode || !eventName) {
    next(new UserError("Invalid query"))
  } else {
    let index;
    const attendanceRanges = {
    pronite: [
      { range: [timeouts.base, timeouts.day_zero], index: 0 },
      { range: [timeouts.day_zero, timeouts.day_one], index: 1 },
      { range: [timeouts.day_one, timeouts.day_two], index: 2 },
      { range: [timeouts.day_two, Infinity], index: 2 }
    ],
    whole_event: [
      { range: [timeouts.base, timeouts.day_zero], index: 3 },
      { range: [timeouts.day_zero, timeouts.day_one], index: 4 },
      { range: [timeouts.day_one, timeouts.day_two], index: 5 },
      { range: [timeouts.day_two, Infinity], index: 5 }
    ]
    };
    
    const dt = new Date().toISOString();
    for (let range of attendanceRanges[event]) {
      if (dt >= range.range[0] && dt < range.range[1]) {
        index = range.index
        break;
      }
    }

    try {
      const userDoc = await User.findOne({ ticketCode })
      if (userDoc) {
        userDoc._doc.attendedEvent[index] = true
        await userDoc.save();
        successHandler(new SuccessResponse("User attendance confirmed"), res)
      } else {
        next(new NotFoundError("Invalid ticket code"))
      }
    } catch (error) {
      next(new ServerError("Ticket could not be processed"))
    }
  }
})

module.exports = { 
  createPurchaseIntent,
  verifyPurchase,
  participateIndividual, 
  participateGroup, 
  getParticipants, 
  getParticipants, 
  addIndividual, 
  addGroup, 
  verify,
  hasAttended
};