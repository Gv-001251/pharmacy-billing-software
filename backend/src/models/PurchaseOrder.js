const { getConnection } = require('../db');

class PurchaseOrder {
  static async create(purchaseData) {
    const connection = getConnection();
    const {
      supplierName,
      supplierInvoiceNumber,
      orderDate = new Date(),
      items,
      totalAmount,
      status = 'pending',
      notes
    } = purchaseData;

    const [result] = await connection.execute(
      `INSERT INTO purchase_orders (supplierName, supplierInvoiceNumber, orderDate, items, totalAmount, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        supplierName,
        supplierInvoiceNumber,
        orderDate,
        JSON.stringify(items),
        totalAmount,
        status,
        notes
      ]
    );

    return this.findById(result.insertId);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM purchase_orders WHERE id = ?',
      [id]
    );
    
    if (rows[0]) {
      // Parse JSON fields
      rows[0].items = JSON.parse(rows[0].items);
    }
    
    return rows[0] || null;
  }

  static async find(filter = {}) {
    const connection = getConnection();
    let query = 'SELECT * FROM purchase_orders WHERE 1=1';
    const values = [];

    // Add ordering
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
    
    // Parse JSON fields
    return rows.map(row => {
      row.items = JSON.parse(row.items);
      return row;
    });
  }

  static async updateById(id, updateData) {
    const connection = getConnection();
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        if (key === 'items') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(updateData[key]));
        } else {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    
    await connection.execute(
      `UPDATE purchase_orders SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async findByIdAndUpdate(id, updateData, options = {}) {
    if (options.runValidators) {
      // Basic validation could be added here if needed
    }
    return this.updateById(id, updateData);
  }

  static async deleteById(id) {
    const connection = getConnection();
    const purchaseOrder = await this.findById(id);
    if (purchaseOrder) {
      await connection.execute('DELETE FROM purchase_orders WHERE id = ?', [id]);
    }
    return purchaseOrder;
  }

  static async findByIdAndDelete(id) {
    return this.deleteById(id);
  }
}

module.exports = PurchaseOrder;