const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for assessment
let tickets = [
    { id: 1, title: 'Database connection retry policy', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Implement JWT refresh mechanism', status: 'Completed', priority: 'Critical' },
    { id: 3, title: 'UI styling for mobile viewport', status: 'Open', priority: 'Medium' }
];

app.get('/api/tickets', (req, res) => {
    res.json({ success: true, data: tickets });
});

app.post('/api/tickets', (req, res) => {
    const { title, priority } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Title required' });

    const newTicket = {
        id: tickets.length ? tickets[tickets.length - 1].id + 1 : 1,
        title,
        status: 'Open',
        priority: priority || 'Medium'
    };

    tickets.push(newTicket);
    res.status(201).json({ success: true, data: newTicket });
});

app.listen(PORT, () => {
    console.log(`IA-02 Full Stack App listening on port ${PORT}`);
});
