const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

let memoryResources = [
  { id: '1', title: 'AI & GPU Compute Lab 1', category: 'High-Performance Computing', capacity: 30, status: 'Available' },
  { id: '2', title: 'Full-Stack Web Dev Studio', category: 'Software Lab', capacity: 45, status: 'Available' },
  { id: '3', title: 'Hardware IoT & Robotics Arena', category: 'Embedded Systems', capacity: 25, status: 'Booked' },
  { id: '4', title: 'Seminar Conference Hall A', category: 'Auditorium', capacity: 120, status: 'Available' }
];

// GET all resources
router.get('/resources', async (req, res) => {
  try {
    const list = await Resource.find();
    if (list && list.length > 0) {
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (e) {}
  return res.json({ success: true, count: memoryResources.length, data: memoryResources, source: 'memory' });
});

// POST toggle booking
router.put('/resources/:id/toggle', async (req, res) => {
  try {
    const resItem = await Resource.findById(req.params.id);
    if (resItem) {
      resItem.status = resItem.status === 'Available' ? 'Booked' : 'Available';
      await resItem.save();
      return res.json({ success: true, data: resItem });
    }
  } catch (e) {}

  const mem = memoryResources.find(r => r.id === req.params.id);
  if (mem) {
    mem.status = mem.status === 'Available' ? 'Booked' : 'Available';
    return res.json({ success: true, data: mem, source: 'memory' });
  }

  return res.status(404).json({ success: false, error: 'Resource not found' });
});

module.exports = router;
