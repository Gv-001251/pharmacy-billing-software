const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  medicines: [{
    name: {
      type: String,
      required: true
    },
    batch: String,
    quantity: {
      type: Number,
      required: true
    },
    mrp: {
      type: Number,
      required: true
    },
    gst: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  totals: {
    subtotal: {
      type: Number,
      required: true
    },
    gst: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'credit', 'upi', 'card'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

billSchema.index({ billNumber: 1 });
billSchema.index({ 'customer.phone': 1 });
billSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Bill', billSchema);
