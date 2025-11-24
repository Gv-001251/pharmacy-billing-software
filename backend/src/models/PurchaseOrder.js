const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
    trim: true
  },
  supplierInvoiceNumber: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    batch: String,
    quantity: {
      type: Number,
      required: true
    },
    costPrice: {
      type: Number,
      required: true
    },
    expiryDate: Date
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'received', 'cancelled'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

purchaseOrderSchema.index({ supplierInvoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
