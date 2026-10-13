const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Assignment 02 - RESTful API Service is running' });
});

app.listen(PORT, () => {
    console.log(`Assignment 02 Service running on port ${PORT}`);
});
