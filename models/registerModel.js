const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "please enter your first name"],
      maxLength: [20, "First Name cannot exceed 30 characters"],
      minLength: [3, "First Name should have more than 2 characters"],

    },

    last_name: {
      type: String,
      required: [true, "please enter your last name"],
      maxLength: [20, "Last Name cannot exceed 20 characters"],

    },

    email: {
      type: String,
      required: [true, "please enter you email"],
      unique: [true, "email address already taken"],
      validate: [validator.isEmail, "Please Enter a valid Email"],

    },

    phone: {
      type: Number,
      required: [true, "please enter you phone number"],
      unique: [true, "phone number already taken"],
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Register", userSchema);
