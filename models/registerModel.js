const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      require: [true, "please enter your first name"],
    },

    last_name: {
        type: String,
        require: [true, "please enter your last name"],
      },

    email: {
      type: String,
      require: [true, "please enter you email"],
      unique: [true, "email address already taken"],
    },

    phone: {
        type: Number,
        require: [true, "please enter you phone number"],
        unique: [true, "phone number already taken"],
      },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Register", userSchema);
