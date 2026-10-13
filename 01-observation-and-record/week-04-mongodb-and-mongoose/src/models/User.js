// User Mongoose Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student'
    },
    age: {
        type: Number,
        min: [16, 'Minimum age is 16'],
        max: [100, 'Maximum age is 100']
    },
    skills: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
