const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
  {
    groupName: {
      type: String,
      minLength: [3, "The group name must have a minimum of three characters"],
      maxLength: [30, "The group name must not exceed thirty characters"],
      required: [true, "Please specify group name"]
    },

    leader: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please specify group leader's ObjectID"]
    }
  }
);

const groupEventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
      minLength: [3, "Name of the event must have more than 3 characters"],
      maxLength: [50, "Name of the event cannot exceed 50 characters"]
    },

    fee: {
      type: Number,
      required: [true, "Please specify the fee for the event"]
    },

    participants: {
      type: [groupSchema]
    }
  },
  { timestamps: true }
);

const individualEventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
      minLength: [3, "Name of the event must have more than 3 characters"],
      maxLength: [50, "Name of the event cannot exceed 50 characters"]
    },

    fee: {
      type: Number,
      required: [true, "Please specify the fee for the event"]
    },

    participants: {
      type: [mongoose.Types.ObjectId]
    }
  },
  { timestamps: true }
);

const individualEvent = mongoose.model("individualEvent", individualEventSchema);
const groupEvent = mongoose.model("groupEvent", groupEventSchema);

module.exports = { individualEvent, groupEvent };