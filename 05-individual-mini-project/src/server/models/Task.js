const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: String,
        enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'General'],
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
