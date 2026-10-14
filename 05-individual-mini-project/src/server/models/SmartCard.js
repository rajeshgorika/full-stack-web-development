const mongoose = require('mongoose');

const smartCardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: [true, 'Card number is required'],
        unique: true,
        trim: true
    },
    cardUID: {
        type: String,
        required: [true, 'NFC/RFID UID is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    holderName: {
        type: String,
        required: [true, 'Cardholder name is required'],
        trim: true
    },
    rollNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    department: {
        type: String,
        default: 'Computer Science & Engineering'
    },
    cardType: {
        type: String,
        enum: ['Student', 'Faculty', 'Staff', 'Visitor'],
        default: 'Student'
    },
    balance: {
        type: Number,
        default: 500.0,
        min: [0, 'Balance cannot be negative']
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Expired'],
        default: 'Active'
    },
    expiryDate: {
        type: Date,
        default: () => new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000) // 4 years validity
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SmartCard', smartCardSchema);
