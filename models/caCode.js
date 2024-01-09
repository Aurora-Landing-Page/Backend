const mongoose = require("mongoose");

const caCode = mongoose.Schema(
    {
    code: {
        type: String,
        required: [true, "Please specify CA code"]
    },

    used: {
        type: Boolean,
        default: false
    },

    createdBy: {
        type: String,
        required: [true, "Please specify admin"]
    }
  },
  { timestamps: true }
);

const Code = mongoose.model("ca_code", caCode);

module.exports = Code;