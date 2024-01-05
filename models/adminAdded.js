const mongoose = require("mongoose");
const validator = require("validator");
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
      validate: {
        validator: validator.isEmail,
        message: "Please enter a valid Email",
      },
    },
    
    phone: {
      type: Number,
      required: [true, "please enter you phone number"]
    },

    participatedIndividual: {
      type: [mongoose.Types.ObjectId]
    },

    participatedGroup: {
      type: Map,
      of: groupSchema
    }
  },
  { timestamps: true }
);

const AdminAddedUser = mongoose.model("admin_added_user", userSchema);
const AdminAddedGroup = mongoose.model("admin_added_group", groupSchema);

module.exports = { AdminAddedUser, AdminAddedGroup };