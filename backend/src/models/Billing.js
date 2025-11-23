const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  items: [
    {
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
    },
  ],
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit'],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  totalGST: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
