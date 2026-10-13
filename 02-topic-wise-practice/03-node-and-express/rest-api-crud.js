// Topic Practice: Complete RESTful CRUD API using Express
const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// In-memory data store for courses
let courses = [
    { id: 1, title: 'HTML5 & Responsive CSS3', durationWeeks: 2 },
    { id: 2, title: 'Modern JavaScript ES6+', durationWeeks: 3 },
    { id: 3, title: 'Node.js & Express Architecture', durationWeeks: 4 }
];

// 1. CREATE: POST /api/courses
app.post('/api/courses', (req, res) => {
    const { title, durationWeeks } = req.body;
    if (!title || !durationWeeks) {
        return res.status(400).json({ error: 'Title and durationWeeks are required' });
    }

    const newCourse = {
        id: courses.length ? courses[courses.length - 1].id + 1 : 1,
        title,
        durationWeeks: Number(durationWeeks)
    };

    courses.push(newCourse);
    res.status(201).json({ success: true, data: newCourse });
});

// 2. READ ALL: GET /api/courses
app.get('/api/courses', (req, res) => {
    res.json({ success: true, count: courses.length, data: courses });
});

// 3. READ ONE: GET /api/courses/:id
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id, 10));
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ success: true, data: course });
});

// 4. UPDATE: PUT /api/courses/:id
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id, 10));
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const { title, durationWeeks } = req.body;
    if (title) course.title = title;
    if (durationWeeks) course.durationWeeks = Number(durationWeeks);

    res.json({ success: true, message: 'Course updated', data: course });
});

// 5. DELETE: DELETE /api/courses/:id
app.delete('/api/courses/:id', (req, res) => {
    const index = courses.findIndex(c => c.id === parseInt(req.params.id, 10));
    if (index === -1) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const [deleted] = courses.splice(index, 1);
    res.json({ success: true, message: 'Course deleted', data: deleted });
});

app.listen(PORT, () => {
    console.log(`CRUD API Server running on http://localhost:${PORT}`);
});
