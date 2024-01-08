const mongoose = require("mongoose");
const validator = require("validator");

const minUser = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should have more than 2 characters"],
  },

  email: {
    type: String,
    required: [true, "please enter your email"],
    // unique: [true, "email address already taken"],
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

  college: {
    type: String,
  }
})

module.exports = minUser;
