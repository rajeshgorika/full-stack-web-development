require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'Group Project Backend API', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ project: 'Campus Resource Booking Portal - Group Project API' });
});

app.listen(PORT, () => {
  console.log(`Group Project Server running on port ${PORT}`);
});
