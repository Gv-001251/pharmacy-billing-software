const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  expiryDate: {
    type: Date,
  },
  gst: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  minStockLevel: {
    type: Number,
    default: 10,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
