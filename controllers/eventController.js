// Library Imports
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

// User Imports
const {NotFoundError, UserError, ServerError} = require("../utils/errors")
const SuccessResponse = require("../utils/successResponses")
const successHandler = require("./successController")
const emailController = require("./emailController")

// Model Imports
const { User, Group } = require("../models/userModel");
const CA = require("../models/caModel");
const event = require("../models/event")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const confirmPayment = async(userId, eventDoc, members) => {
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

const purchaseTickets = asyncHandler(async (req, res, next) => {
  
})

const participateIndividual = asyncHandler(async (req, res, next) => {
  const { eventId } = req.body;
  const token = req.cookies.jwt;
  console.log(obj)
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
        console.log(obj)

        if (alreadyParticipated) {
          next(new UserError("Already participated in this event!", 409))
        } else {
          // Defaults to true for now as confirmPayment has not been implemented
          const paid = await confirmPayment(id, eventDoc) || true;
  
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
          // Defaults to true for now as confirmPayment has not been implemented
          const paid = await confirmPayment(id, eventDoc) || true;
  
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
                    as: "participant"
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
                    as: "leader"
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

module.exports = { purchaseTickets, participateIndividual, participateGroup, getParticipants, getParticipants };
