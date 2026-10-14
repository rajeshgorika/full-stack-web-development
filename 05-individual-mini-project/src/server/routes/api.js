const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// In-memory fallback if MongoDB is not connected
let memoryTasks = [
    { _id: '1', title: 'Complete Frontend UI Design', category: 'Frontend', priority: 'High', completed: true },
    { _id: '2', title: 'Set up Express REST Routes', category: 'Backend', priority: 'High', completed: true },
    { _id: '3', title: 'Deploy Application to Vercel & Render', category: 'DevOps', priority: 'Medium', completed: false }
];

// GET /api/tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        return res.json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        // Fallback to in-memory store
        return res.json({ success: true, count: memoryTasks.length, data: memoryTasks, source: 'memory' });
    }
});

// POST /api/tasks
router.post('/tasks', async (req, res) => {
    const { title, description, category, priority } = req.body;
    if (!title) {
        return res.status(400).json({ success: false, error: 'Please provide task title' });
    }

    try {
        const newTask = await Task.create({ title, description, category, priority });
        return res.status(201).json({ success: true, data: newTask });
    } catch (err) {
        const fallbackTask = {
            _id: String(Date.now()),
            title,
            description: description || '',
            category: category || 'General',
            priority: priority || 'Medium',
            completed: false
        };
        memoryTasks.unshift(fallbackTask);
        return res.status(201).json({ success: true, data: fallbackTask, source: 'memory' });
    }
});

// PUT /api/tasks/:id/toggle
router.put('/tasks/:id/toggle', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            task.completed = !task.completed;
            await task.save();
            return res.json({ success: true, data: task });
        }
    } catch (err) {
        // Fallback
    }

    const memTask = memoryTasks.find(t => t._id === req.params.id);
    if (memTask) {
        memTask.completed = !memTask.completed;
        return res.json({ success: true, data: memTask });
    }

    return res.status(404).json({ success: false, error: 'Task not found' });
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (task) {
            return res.json({ success: true, message: 'Task deleted', data: task });
        }
    } catch (err) {
        // Fallback
    }

    const idx = memoryTasks.findIndex(t => t._id === req.params.id);
    if (idx !== -1) {
        const [deleted] = memoryTasks.splice(idx, 1);
        return res.json({ success: true, message: 'Task deleted', data: deleted });
    }

    return res.status(404).json({ success: false, error: 'Task not found' });
});

module.exports = router;
