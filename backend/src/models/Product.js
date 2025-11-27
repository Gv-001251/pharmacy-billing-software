const { getConnection } = require('../db');

class Product {
  static async create(productData) {
    const connection = getConnection();
    const {
      name,
      batch,
      quantity = 0,
      mrp,
      gst = 0,
      costPrice = 0,
      expiryDate,
      category = 'Medicine',
      manufacturer,
      minStockLevel = 10
    } = productData;

    const [result] = await connection.execute(
      `INSERT INTO products (name, batch, quantity, mrp, gst, costPrice, expiryDate, category, manufacturer, minStockLevel)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, batch, quantity, mrp, gst, costPrice, expiryDate, category, manufacturer, minStockLevel]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findOne(filter) {
    const connection = getConnection();
    let query = 'SELECT * FROM products WHERE ';
    const conditions = [];
    const values = [];

    if (filter.name) {
      conditions.push('name = ?');
      values.push(filter.name);
    }
    if (filter.batch) {
      conditions.push('batch = ?');
      values.push(filter.batch);
    }

    query += conditions.join(' AND ');
    
    const [rows] = await connection.execute(query, values);
    return rows[0] || null;
  }

  static async find(filter = {}) {
    const connection = getConnection();
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];

    // Handle text search
    if (filter.$text) {
      query += ' AND (name LIKE ? OR batch LIKE ?)';
      values.push(`%${filter.$text.$search}%`, `%${filter.$text.$search}%`);
    }

    // Handle low stock filter
    if (filter.$expr) {
      if (filter.$expr.$lte && filter.$expr.$lte.length === 2) {
        query += ' AND quantity <= minStockLevel';
      }
    }

    // Handle OR conditions for search
    if (filter.$or) {
      const orConditions = [];
      filter.$or.forEach(condition => {
        if (condition.name) {
          orConditions.push('name LIKE ?');
          values.push(`%${condition.name.$regex}%`);
        }
        if (condition.batch) {
          orConditions.push('batch LIKE ?');
          values.push(`%${condition.batch.$regex}%`);
        }
      });
      if (orConditions.length > 0) {
        query += ' AND (' + orConditions.join(' OR ') + ')';
      }
    }

    // Handle date range for expiry
    if (filter.expiryDate) {
      if (filter.expiryDate.$lte) {
        query += ' AND expiryDate <= ?';
        values.push(filter.expiryDate.$lte);
      }
    }

    // Add ordering
    query += ' ORDER BY createdAt DESC';

    const [rows] = await connection.execute(query, values);
    return rows;
  }

  static async countDocuments(filter = {}) {
    const connection = getConnection();
    let query = 'SELECT COUNT(*) as count FROM products WHERE 1=1';
    const values = [];

    // Handle text search
    if (filter.$text) {
      query += ' AND (name LIKE ? OR batch LIKE ?)';
      values.push(`%${filter.$text.$search}%`, `%${filter.$text.$search}%`);
    }

    // Handle low stock filter
    if (filter.$expr) {
      if (filter.$expr.$lte && filter.$expr.$lte.length === 2) {
        query += ' AND quantity <= minStockLevel';
      }
    }

    const [rows] = await connection.execute(query, values);
    return rows[0].count;
  }

  static async updateById(id, updateData) {
    const connection = getConnection();
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    
    await connection.execute(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async findByIdAndDelete(id) {
    const connection = getConnection();
    const product = await this.findById(id);
    if (product) {
      await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    }
    return product;
  }

  static async search(searchTerm, limit = 10) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT id, name, batch, mrp, gst, manufacturer 
       FROM products 
       WHERE name LIKE ? OR batch LIKE ? 
       ORDER BY name 
       LIMIT ${parseInt(limit)}`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }
}

module.exports = Product;