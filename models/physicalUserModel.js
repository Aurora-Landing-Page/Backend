const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    // Not performing validation here to allow null values
    name: String,
    email:  String,
    phone: Number,
    
    purchasedTickets: {
      type: [Boolean],
      default: [true, true, true, true, true, true],
      validate: {
        // Set max length of array to 6 elements
        validator: (arr) => { return arr === undefined || arr === null || (Array.isArray(arr) && arr.length === 6) },
        message: "Invalid length of array"
      },
    },
    
    attendedEvent: {
      type: [Boolean],
      default: [false, false, false, false, false, false],
      validate: {
        // Set max length of array to 6 elements
        validator: (arr) => { return arr === undefined || arr === null || (Array.isArray(arr) && arr.length === 6) },
        message: "Invalid length of array"
      }
    },

    // 6 character unique ticket code for online verification
    ticketCode: {
      type: String,
      required: [true, "Please specify the ticket code"],
      unique: [true, "Invalid ticket code"]
    },

    onlineRegistrationDone: {
        type: Boolean,
        default: false
    },

    freeParticipations: {
        type: Number,
        default: 0
    }
  },
  { timestamps: true }
);

const PhysicalUser = mongoose.model("physical_user", userSchema);
module.exports = { PhysicalUser };