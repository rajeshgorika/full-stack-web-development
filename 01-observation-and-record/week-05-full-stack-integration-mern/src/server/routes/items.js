const express = require('express');
const router = express.Router();

let items = [
  { id: 1, name: 'MERN Stack Environment Setup' },
  { id: 2, name: 'React State Hook & Fetch Setup' },
  { id: 3, name: 'Express API Route Integration' }
];

// GET items
router.get('/', (req, res) => {
  res.json({ success: true, count: items.length, data: items });
});

// POST items
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }
  const newItem = { id: items.length + 1, name };
  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

module.exports = router;
