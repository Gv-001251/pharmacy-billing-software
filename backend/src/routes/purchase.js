const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find().populate('productId');
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('productId');
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity, unitPrice, gst, expiryDate } = req.body;

    const purchase = new Purchase({
      productId,
      quantity,
      unitPrice,
      gst,
      expiryDate,
    });

    const savedPurchase = await purchase.save();

    const product = await Product.findById(productId);
    if (product) {
      product.quantity += quantity;
      if (!product.expiryDate || new Date(expiryDate) > product.expiryDate) {
        product.expiryDate = expiryDate;
      }
      product.gst = gst;
      await product.save();
    }

    await savedPurchase.populate('productId');
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/return', async (req, res) => {
  try {
    const { returnReason } = req.body;
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        isReturned: true,
        returnDate: new Date(),
        returnReason,
      },
      { new: true }
    ).populate('productId');

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    const product = await Product.findById(purchase.productId._id);
    if (product) {
      product.quantity = Math.max(0, product.quantity - purchase.quantity);
      await product.save();
    }

    res.json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    res.json({ message: 'Purchase deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
