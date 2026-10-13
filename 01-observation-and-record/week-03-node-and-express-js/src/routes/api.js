const express = require('express');
const router = express.Router();

// Mock in-memory items database
let items = [
    { id: 1, name: 'HTML5 & CSS3 Manual', category: 'Frontend' },
    { id: 2, name: 'Modern JavaScript Guide', category: 'Frontend' },
    { id: 3, name: 'Node.js & Express Deep Dive', category: 'Backend' }
];

// GET all items
router.get('/items', (req, res) => {
    res.json({
        success: true,
        count: items.length,
        data: items
    });
});

// GET single item by ID
router.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = items.find(i => i.id === id);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: `Item with id ${id} not found.`
        });
    }

    res.json({
        success: true,
        data: item
    });
});

// POST new item
router.post('/items', (req, res) => {
    const { name, category } = req.body;

    if (!name || !category) {
        return res.status(400).json({
            success: false,
            message: 'Please provide both name and category.'
        });
    }

    const newItem = {
        id: items.length ? items[items.length - 1].id + 1 : 1,
        name,
        category
    };

    items.push(newItem);

    res.status(201).json({
        success: true,
        message: 'Item created successfully.',
        data: newItem
    });
});

// DELETE item
router.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Item with id ${id} not found.`
        });
    }

    const deleted = items.splice(index, 1);
    res.json({
        success: true,
        message: 'Item deleted successfully.',
        data: deleted[0]
    });
});

module.exports = router;
