const express = require('express');
const router = express.Router();
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
  try {
    const { items } = req.body;

    const purchaseOrder = await PurchaseOrder.create(req.body);

    if (items && items.length) {
      for (const item of items) {
        const product = await Product.findOne({ name: item.name, batch: item.batch });

        if (product) {
          await Product.updateById(product.id, {
            quantity: product.quantity + item.quantity,
            costPrice: item.costPrice,
            expiryDate: item.expiryDate || product.expiryDate
          });
        } else {
          await Product.create({
            name: item.name,
            batch: item.batch,
            quantity: item.quantity,
            mrp: item.costPrice * 1.2,
            gst: 12,
            expiryDate: item.expiryDate,
            manufacturer: req.body.supplierName,
            minStockLevel: 10,
            category: 'Medicine'
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: purchaseOrder
    });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating purchase order',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrder.find();
    res.json({
      success: true,
      data: purchaseOrders
    });
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase orders',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findById(req.params.id);

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    res.json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase order',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    res.json({
      success: true,
      message: 'Purchase order updated successfully',
      data: purchaseOrder
    });
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating purchase order',
      error: error.message
    });
  }
});

module.exports = router;
