require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint for cloud monitoring (Render / UptimeRobot)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        service: 'Smart Card Identity & Digital Wallet API',
        timestamp: new Date().toISOString()
    });
});

// Mount API routes
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (req, res) => {
    res.json({
        project: 'Smart Card Identity & Digital Wallet System',
        endpoints: {
            health: '/health',
            cards: '/api/cards',
            transactions: '/api/transactions',
            stats: '/api/stats'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Smart Card Backend API Server is running on port ${PORT}`);
});
