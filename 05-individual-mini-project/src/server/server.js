require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

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
        service: 'Smart Traffic Signal Optimisation API',
        timestamp: new Date().toISOString()
    });
});

// Mount Traffic API routes
app.use('/api/traffic', apiRoutes);
app.use('/api', apiRoutes); // Backwards compatibility for root api

// Root greeting
app.get('/', (req, res) => {
    res.json({
        project: 'Smart Traffic Signal Optimisation System',
        database: 'Local JSON Database (trafficDB.json)',
        endpoints: {
            health: '/health',
            junctions: '/api/traffic/junctions',
            logs: '/api/traffic/logs'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Smart Traffic Signal Server is running on http://localhost:${PORT}`);
});
