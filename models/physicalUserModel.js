const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 2 characters"],
    },

    email: {
      type: String,
      unique: [true, "email address already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid Email",
      },
    },
    
    phone: {
      type: Number,
      unique: [true, "phone number already taken"],
    },
    
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
      required: [true, "Please specify the ticket code"]
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