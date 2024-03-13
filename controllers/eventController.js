// Library Imports
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Jimp = require("jimp");

// User Imports
const {NotFoundError, UserError, ServerError} = require("../utils/errors")
const SuccessResponse = require("../utils/successResponses")
const successHandler = require("./successController")
const { timeouts } = require("../utils/constants")
const { AdminAddedUser } = require("../models/adminAdded")
const userController = require("./userController")
const emailController = require("./emailController")

// Model Imports
const { User, Group } = require("../models/userModel");
const { PhysicalUser } = require("../models/physicalUserModel");
const Receipt = require("../models/paymentReceipt");
const ManualPayment = require("../models/manualPayment");
const event = require("../models/event")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const sendQR = async(name, email, phone, ticketCode, receiptId) => {
  try {
    const ticketImage = await userController.generateTicket(name, email, phone, ticketCode)
    const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
    await emailController.sendQRMail(name, email, buffer, ticketCode, receiptId);
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

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
                  successHandler(new SuccessResponse("DB Query Successful"), res, { participants: obj, number: obj.length })
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
              let number = 0;
              obj.forEach((element) => {
                number += element.group.members.length
              })

              successHandler(new SuccessResponse("DB Query Successful"), res, { leaders: obj, number })
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

const getParticipantsv2 = asyncHandler(async(req, res, next) => {
  const {eventId} = req.body;
  if (!eventId) { next(new UserError("Malformed Request!")) }
  else {
    try {
      const eventDoc = await event.findById(eventId)
      const participants = await ManualPayment.find({ 'data.eventId': eventId })
    
      successHandler(new SuccessResponse("Query successful!"), res, { 
        eventName: eventDoc._doc.name,
        participants, 
        number: participants.length 
      });
      return;
    } catch (e) {
      console.error(e);
      next(new ServerError(e.message));
    }
  }
})

const getReceipt = asyncHandler(async(req, res, next) => {
  const { receiptId } = req.query

  if (!receiptId) {
    next(new UserError("Invalid query"))
  } else {
    try {
      const receiptDoc = await Receipt.findOne({ receiptId })
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

const verify = asyncHandler(async(req, res, next) => {
  const { ticketCode } = req.query

  if (!ticketCode) {
    next(new UserError("Invalid query"))
  } else {
    try {
      const payments = await ManualPayment.find({ ticketCode })
      let events = [];
      let data = [];
      let pronite = false;

      if (payments.length != 0) {
        console.log(payments)
        for (const payment of payments) {
          if (payment._doc.data.type == "purchase_individual" || payment._doc.data.type == "purchase_group") { 
            pronite = true; 
            const {__v, createdAt, updatedAt, _id, ...otherFields} = payment._doc;
            data.push(otherFields);
          } else if (payment._doc.data.type == "participate_individual" || payment._doc.data.type == "participate_group") {
            const eventDoc = await event.findById(payment.data.eventId);
            const name = eventDoc._doc.name;
            events.push(name);
            const {__v, createdAt, updatedAt, _id, ...otherFields} = payment._doc;
            data.push(otherFields);
          }
        }
        successHandler(new SuccessResponse("User Found!"), res, { pronite, events, data })
      } else {
        next(new NotFoundError("User with corresponding ticket code could not be found"))
      }
    } catch (error) {
      console.error(error)
      next(new ServerError("Ticket could not be verified"))
    }
  }
})

const physicalVerify = asyncHandler(async(req, res, next) => {
  const { ticketCode } = req.query

  if (!ticketCode) {
    next(new UserError("Invalid query"))
  } else {
    try {
      const userDoc = await PhysicalUser.findOne({ ticketCode })
      if (userDoc) {
        const {__v, createdAt, updatedAt, _id, ...otherFields} = userDoc._doc;
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
  sendQR,
  getParticipants,
  getParticipantsv2,
  getReceipt,
  addIndividual, 
  addGroup, 
  verify,
  physicalVerify,
  hasAttended
};