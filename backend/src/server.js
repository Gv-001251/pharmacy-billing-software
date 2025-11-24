const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const inventoryRoutes = require('./routes/inventory');
const purchaseRoutes = require('./routes/purchase');
const billingRoutes = require('./routes/billing');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/billing', billingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Pharmacy API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to AISHWARYA PHARMACY API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      inventory: '/api/inventory',
      purchase: '/api/purchase',
      billing: '/api/billing'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Pharmacy Backend Server running on port ${PORT}`);
});

module.exports = app;
