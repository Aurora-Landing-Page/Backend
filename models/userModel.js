const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const minUser = require("./minUser");

const groupSchema = mongoose.Schema(
  {
    groupName: {
      type: String,
      minLength: [3, "The group name must have a minimum of three characters"],
      maxLength: [30, "The group name must not exceed thirty characters"],
      required: [true, "Please specify group name"]
    },

    members: {
      type: [minUser],
      required: [true, "Please specify group members"]
    }
  }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 2 characters"],
    },

    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: [true, "email address already taken"],
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid Email",
      },
    },
    
    phone: {
      type: Number,
      required: [true, "please enter you phone number"],
      unique: [true, "phone number already taken"],
    },
    
    // Optional Fields
    gender: { type: String },
    college: { type: String },
    city: { type: String },
    dob: { type: Date },
    
    password: {
      type: String,
      required: [true, "please enter your password"],
    },

    earlySignup: {
      type: Boolean,
      default: false
    },

    groupPurchase: {
      type: [minUser]
    },

    accomodation: {
      type: Boolean,
      default: false
    },

    participatedIndividual: {
      type: [mongoose.Types.ObjectId]
    },

    participatedGroup: {
      type: Map,
      of: groupSchema
    },

    purchasedTickets: {
      type: [Boolean],
      default: [false, false],
      validate: {
        // Set max length of array to 2 elements
        validator: (arr) => { return arr === undefined || arr === null || (Array.isArray(arr) && arr.length === 2) },
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
    }},
    
    isAdmin: {
      type: Boolean,
      default: false
    },
    
    // 6 character unique ticket code for online verification
    ticketCode: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email })

  try {
    if (user) {
      const auth = await bcrypt.compare(password, user.password)
      if (auth) {
          return user
      } 
      throw new Error("Invalid password")
    }
    throw new Error("User does not exist")
  } catch (error) {
    throw error
  }
}

const User = mongoose.model("user", userSchema);
const Group = mongoose.model("group", groupSchema);
module.exports = {User, Group};