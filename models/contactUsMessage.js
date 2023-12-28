const mongoose = require("mongoose");
const validator = require("validator");

const contactUsSchema = mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Please specify the name of the event"],
        minLength: [3, "Name of the event must have a minimum of 3 characters"],
        maxLength: [50, "Name of the event cannot exceed 50 characters"]
    },

    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: validator.isEmail,
            message: "Please enter a valid email",
        },
    }, 

    subject: {
        type: String,
        required: [true, "Please enter the subject"]
    },

    message: {
        type: String,
        required: [true, "Please enter the message"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contact_us_message", contactUsSchema);