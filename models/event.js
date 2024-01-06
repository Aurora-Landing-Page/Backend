const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please specify the name of the event"],
      minLength: [3, "Name of the event must have a minimum of 3 characters"],
      maxLength: [50, "Name of the event cannot exceed 50 characters"]
    },

    fee: {
      type: Number,
      required: [true, "Please specify the fee for the event"]
    },

    participants: {
      type: [mongoose.Types.ObjectId]
    },

    isGroup: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);