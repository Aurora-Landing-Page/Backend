const mongoose = require("mongoose");
const validator = require("validator");

const receiptSchema = mongoose.Schema(
  {
    orderId: {
        type: String,
        required: [true, "Please specify the Razorpay order ID"]
    },

    // Populated at the time of payment verification, hence required is not set here
    paymentId: {
        type: String
    },

    receiptId: {
        type: String,
        required: [true, "Please specify the receipt ID"]
    },
    
    // purchase or participation
    type: {
        type: String,
        required: [true, "Please specify type"],
        enum: ["purchase_individual", "purchase_group", "participate_individual", "participate_group"] 
    },

    ticketCode: {
        type: String,
        required: [true, "Please specify the ticket code"]
    }, 

    data: {
        type: Object
    },

    verified: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment_receipt", receiptSchema);