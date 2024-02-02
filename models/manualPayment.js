const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    receiptId: {
        type: String,
        required: [true, "Receipt ID not set"]
    },

    ticketCode: {
        type: String,
        required: [true, "Ticket Code not set"]
    },

    amount: {
        type: Number,
        required: [true, "Amount not set"]
    },

    imageUrl: {
        type: String,
        default: ""
    },

    data: {
        type: Object,
        required: [true, "Intent not set"]
    },

    approved: {
        type: Boolean,
        default: false
    },

    denied: {
        type: Boolean,
        default: false
    }
    }, 
    { timestamps: true }
);

const ManualPayment  = mongoose.model('manual_payment', PaymentSchema)
module.exports = ManualPayment;