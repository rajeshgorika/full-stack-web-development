const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SmartCard'
    },
    cardNumber: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Recharge', 'Tap & Pay', 'Gate Access'],
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Success', 'Failed - Insufficient Balance', 'Failed - Card Blocked'],
        default: 'Success'
    },
    remarks: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
