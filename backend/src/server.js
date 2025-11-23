require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const inventoryRoutes = require('./routes/inventory');
const purchaseRoutes = require('./routes/purchase');
const billingRoutes = require('./routes/billing');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/billing', billingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Pharmacy Billing Backend API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
