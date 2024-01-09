const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const minUser = require("./minUser.js");

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

const caSchema = mongoose.Schema(
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
      enum: ["Male", "Female", "Non-Binary"]
    },

    
    password: {
      type: String,
      required: [true, "please enter you password"],
    },
    
    referralCode: {
      type: String,
      required: [true, "Please specify referral code"],
    },
    
    referrals: {
      type: [minUser],
    },
    
    caCode: {
      type: String,
      required: [true, "Please specify CA code"]
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
      default: [false, false, false, false, false, false],
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

    college: { type: String },
    city: { type: String },
    dob: { type: Date }
  },
  { timestamps: true }
);

caSchema.statics.login = async function (email, password) {
  const ca = await this.findOne({ email })

  try {
    if (ca) {
      const auth = await bcrypt.compare(password, ca.password)
      if (auth) {
          return ca
      } 
      throw new Error("Invalid password")
    }
    else { throw new Error("User does not exist") }
  } catch (error) {
    throw error
  }
}

module.exports = mongoose.model("CA", caSchema);
