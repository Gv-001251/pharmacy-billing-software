const { getConnection } = require('../db');

class Bill {
  static async create(billData) {
    const connection = getConnection();
    const {
      billNumber,
      customer,
      medicines,
      totals,
      paymentMode = 'cash',
      status = 'completed'
    } = billData;

    const [result] = await connection.execute(
      `INSERT INTO bills (billNumber, customerName, customerPhone, medicines, subtotal, gst, total, paymentMode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        billNumber,
        customer.name,
        customer.phone,
        JSON.stringify(medicines),
        totals.subtotal,
        totals.gst,
        totals.total,
        paymentMode,
        status
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM bills WHERE id = ?',
      [id]
    );
    
    if (rows[0]) {
      // Parse JSON fields
      rows[0].medicines = JSON.parse(rows[0].medicines);
      rows[0].customer = {
        name: rows[0].customerName,
        phone: rows[0].customerPhone
      };
      rows[0].totals = {
        subtotal: rows[0].subtotal,
        gst: rows[0].gst,
        total: rows[0].total
      };
      
      // Remove redundant fields
      delete rows[0].customerName;
      delete rows[0].customerPhone;
    }
    
    return rows[0] || null;
  }

  static async find(filter = {}) {
    const connection = getConnection();
    let query = 'SELECT * FROM bills WHERE 1=1';
    const values = [];

    // Handle search
    if (filter.$or) {
      const orConditions = [];
      filter.$or.forEach(condition => {
        if (condition.billNumber) {
          orConditions.push('billNumber LIKE ?');
          values.push(`%${condition.billNumber.$regex}%`);
        }
        if (condition['customer.name']) {
          orConditions.push('customerName LIKE ?');
          values.push(`%${condition['customer.name'].$regex}%`);
        }
        if (condition['customer.phone']) {
          orConditions.push('customerPhone LIKE ?');
          values.push(`%${condition['customer.phone'].$regex}%`);
        }
      });
      if (orConditions.length > 0) {
        query += ' AND (' + orConditions.join(' OR ') + ')';
      }
    }

    // Handle date range
    if (filter.createdAt) {
      if (filter.createdAt.$gte) {
        query += ' AND createdAt >= ?';
        values.push(filter.createdAt.$gte);
      }
      if (filter.createdAt.$lte) {
        query += ' AND createdAt <= ?';
        values.push(filter.createdAt.$lte);
      }
    }

    // Add ordering and pagination
    query += ' ORDER BY createdAt DESC';

    // Handle limit and skip if provided
    if (filter.limit) {
      query += ' LIMIT ?';
      values.push(filter.limit);
    }
    if (filter.skip) {
      query += ' OFFSET ?';
      values.push(filter.skip);
    }

    const [rows] = await connection.execute(query, values);
    
    // Parse JSON fields and format response
    return rows.map(row => {
      row.medicines = JSON.parse(row.medicines);
      row.customer = {
        name: row.customerName,
        phone: row.customerPhone
      };
      row.totals = {
        subtotal: row.subtotal,
        gst: row.gst,
        total: row.total
      };
      
      delete row.customerName;
      delete row.customerPhone;
      
      return row;
    });
  }

  static async countDocuments(filter = {}) {
    const connection = getConnection();
    let query = 'SELECT COUNT(*) as count FROM bills WHERE 1=1';
    const values = [];

    // Handle search
    if (filter.$or) {
      const orConditions = [];
      filter.$or.forEach(condition => {
        if (condition.billNumber) {
          orConditions.push('billNumber LIKE ?');
          values.push(`%${condition.billNumber.$regex}%`);
        }
        if (condition['customer.name']) {
          orConditions.push('customerName LIKE ?');
          values.push(`%${condition['customer.name'].$regex}%`);
        }
        if (condition['customer.phone']) {
          orConditions.push('customerPhone LIKE ?');
          values.push(`%${condition['customer.phone'].$regex}%`);
        }
      });
      if (orConditions.length > 0) {
        query += ' AND (' + orConditions.join(' OR ') + ')';
      }
    }

    // Handle date range
    if (filter.createdAt) {
      if (filter.createdAt.$gte) {
        query += ' AND createdAt >= ?';
        values.push(filter.createdAt.$gte);
      }
      if (filter.createdAt.$lte) {
        query += ' AND createdAt <= ?';
        values.push(filter.createdAt.$lte);
      }
    }

    const [rows] = await connection.execute(query, values);
    return rows[0].count;
  }

  static async aggregate(pipeline) {
    const connection = getConnection();
    
    // Handle today's sales aggregation
    if (pipeline.length === 1 && pipeline[0].$match && pipeline[0].$match.createdAt) {
      const today = pipeline[0].$match.createdAt.$gte;
      
      const [rows] = await connection.execute(
        `SELECT 
           SUM(total) as total,
           COUNT(*) as count
         FROM bills 
         WHERE createdAt >= ?`,
        [today]
      );
      
      return [{
        _id: null,
        total: rows[0].total || 0,
        count: rows[0].count || 0
      }];
    }
    
    return [];
  }

  static async getStats() {
    const connection = getConnection();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [rows] = await connection.execute(
      `SELECT 
         SUM(total) as todaysSales,
         COUNT(*) as todaysBills
       FROM bills 
       WHERE createdAt >= ?`,
      [today]
    );
    
    return {
      todaysSales: rows[0].todaysSales || 0,
      todaysBills: rows[0].todaysBills || 0
    };
  }
}

module.exports = Bill;