const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import Routes
const productRoutes = require('./routes/products');
const bidRoutes = require('./routes/bids');
const groupRoutes = require('./routes/groups');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/groups', groupRoutes);

app.get('/', (req, res) => {
  res.send('HNP Live Auction API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
