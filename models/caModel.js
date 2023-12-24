const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const minUser = require("./minUser.js");

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
      required: [true, "please enter you password"],
    },

    dob: {
      type: Date,
      required: [true, "please enter you dob"],
    },

    referralCode: {
      type: String,
      required: [true, "please add referral code"],
    },

    // Arrays are automatically initialised to [] if not defined in create request
    referrals: {
      type: [minUser],
    }
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
