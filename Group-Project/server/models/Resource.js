const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    default: 30
  },
  status: {
    type: String,
    enum: ['Available', 'Booked', 'Under Maintenance'],
    default: 'Available'
  },
  bookedBy: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
