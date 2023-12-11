const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
      required: [true, "please enter you password"],
    },

    dob: {
      type: Date,
      required: [true, "please enter you dob"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Register", userSchema);
