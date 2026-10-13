// Topic Practice: Express Middleware Demonstration
const express = require('express');
const app = express();
const PORT = 3001;

// 1. Application-level middleware: Request Logger
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[LOGGER] ${timestamp} - ${req.method} ${req.originalUrl}`);
    next();
};

// 2. Authentication Mock Middleware (Route Guard)
const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader === 'Bearer secret-token-123') {
        next();
    } else {
        res.status(401).json({
            error: 'Unauthorized: Missing or invalid Authorization header (Bearer secret-token-123)'
        });
    }
};

app.use(express.json());
app.use(requestLogger);

// Public route
app.get('/public', (req, res) => {
    res.json({ message: 'This is a public endpoint accessible by anyone.' });
});

// Protected route using route-specific middleware
app.get('/protected', checkAuth, (req, res) => {
    res.json({ message: 'Welcome to the protected resource!', user: 'authenticated-user' });
});

// Global Error-Handling Middleware
app.use((err, req, res, next) => {
    console.error('Handled Error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
    console.log(`Middleware Demo running on http://localhost:${PORT}`);
});
