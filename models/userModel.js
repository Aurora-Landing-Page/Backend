const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const minUser = require("./minUser");

const groupSchema = mongoose.Schema(
  {
    eventID: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please specify the event your group is participating in"]
    },

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
    
    gender: {
      type: String,
      required: [true, "please enter you gender"],
    },
    
    college: {
      type: String,
    },
    
    city: {
      type: String,
      required: [true, "please enter you city"],
    },
    
    password: {
      type: String,
      required: [true, "please enter your password"],
    },

    dob: {
      type: Date,
      required: [true, "please enter you dob"],
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
      type: [groupSchema],
    },

    purchasedTickets: {
      // Array is expected to be of the format
      // [flag, pronite1, pronite2, pronite3, wholeEvent1, wholeEvent2, wholeEvent3]
      // flag signifies if any ticket is purchased for the event
      // Each subsequent element signifies if the user can attend that particular event
      
      type: [Boolean],
      default: [false, false, false, false, false, false, false],
      validate:{
        // Set max length of array to 7 elements
        validator: (arr) => { return arr === undefined || arr === null || (Array.isArray(arr) && arr.length === 7) },
        message: "Invalid length of array"
      },
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

userSchema.statics.verify = async function (ticketCode) {
  const user = await this.findOne({ ticketCode })
  try {
    if (user) {
        return user
    }
    else { throw new Error("User not found") }
  } catch (error) {
    throw error
  }
}

module.exports = mongoose.model("user", userSchema);