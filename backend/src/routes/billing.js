const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

router.post('/', async (req, res) => {
  try {
    const { customer, medicines, totals, paymentMode } = req.body;
    
    const billNumber = `BILL-${Date.now()}`;
    
    const bill = new Bill({
      billNumber,
      customer,
      medicines,
      totals,
      paymentMode
    });
    
    await bill.save();
    
    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill
    });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating bill',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, startDate, endDate } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { billNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const bills = await Bill.find({
      ...query,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });
    
    const total = await Bill.countDocuments(query);
    
    res.json({
      success: true,
      data: bills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bills',
      error: error.message
    });
  }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Bill.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    
    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill',
      error: error.message
    });
  }
});

module.exports = router;
