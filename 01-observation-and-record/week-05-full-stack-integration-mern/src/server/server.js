const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MERN Integration Server Running' });
});

app.listen(PORT, () => {
  console.log(`MERN Backend Server listening on port ${PORT}`);
});
