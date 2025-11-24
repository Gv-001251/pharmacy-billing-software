const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  batch: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  mrp: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    default: 0
  },
  costPrice: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date
  },
  category: {
    type: String,
    enum: ['Medicine', 'Supplement', 'Medical Equipment', 'Other'],
    default: 'Medicine'
  },
  manufacturer: {
    type: String
  },
  minStockLevel: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', batch: 'text' });

module.exports = mongoose.model('Product', productSchema);
