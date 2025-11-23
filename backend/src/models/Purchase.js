const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  gst: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  expiryDate: {
    type: Date,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
  returnDate: {
    type: Date,
  },
  returnReason: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
