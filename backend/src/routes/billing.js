const express = require('express');
const router = express.Router();
const Billing = require('../models/Billing');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const billings = await Billing.find().populate('items.productId');
    res.json(billings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id).populate('items.productId');
    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }
    res.json(billing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, items, paymentMethod } = req.body;

    let totalAmount = 0;
    let totalGST = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}`,
        });
      }

      const itemTotal = item.unitPrice * item.quantity;
      const itemGST = itemTotal * (item.gst / 100);
      totalAmount += itemTotal + itemGST;
      totalGST += itemGST;

      product.quantity -= item.quantity;
      await product.save();
    }

    const billing = new Billing({
      customerName,
      customerPhone,
      items,
      paymentMethod,
      totalAmount,
      totalGST,
    });

    const savedBilling = await billing.save();
    await savedBilling.populate('items.productId');
    res.status(201).json(savedBilling);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.productId');

    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }
    res.json(billing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }
    res.json({ message: 'Billing record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
