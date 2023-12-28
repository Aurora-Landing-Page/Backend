// Library Imports
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose")

// User Imports
const {NotFoundError, UserError, ServerError} = require("../utils/errors")
const SuccessResponse = require("../utils/successResponses")
const successHandler = require("./successController")
const emailController = require("./emailController")

// Model Imports
const User = require("../models/userModel");
const CA = require("../models/caModel");
const event = require("../models/event")

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

const purchaseTickets = asyncHandler(async (req, res, next) => {

})

const participateIndividual = asyncHandler(async (req, res, next) => {

})

const participateGroup = asyncHandler(async (req, res, next) => {

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
                        {
                          $match: {
                            _id: new mongoose.Types.ObjectId(eventId)
                          }
                        },
                        {
                          $lookup: {
                            from: "users",
                            localField: "participants.0",
                            foreignField: "id",
                            as: "participant"
                          }
                        },
                        {
                          $unwind: "$participant"
                        },
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
                            console.log(obj)
                            successHandler(new SuccessResponse("DB Query Successful"), res, { participants: obj })
                       })
                       .catch(err => {
                            console.error(err)
                            next(new ServerError(err.message))
                       })               
                } else {
                    event.aggregate([
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(eventId)
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "participants.0",
                                foreignField: "id",
                                as: "leader"
                            }
                        },
                        {
                            $unwind: "$leader"
                        },
                        {
                         $addFields: {
                           participatedGroups: {
                             $map: {
                               input: "$leader.participatedGroup",
                               as: "group",
                               in: {
                                 $cond: [{ $eq: ["$$group.eventID", new mongoose.Types.ObjectId(eventId)] }, "$$group.groupName", null]
                               }
                             }
                           }
                         }
                        },
                        {
                         $project: {
                           _id: "$leader._id",
                           name: "$leader.name",
                           email: "$leader.email",
                           phone: "$leader.phone",
                           participatedGroups: 1,
                           members: "$leader.participatedGroup.members"
                         }
                        }
                   ])
                   .exec()
                   .then(obj => {
                        console.log(obj)
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
