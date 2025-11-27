const mysql = require('mysql2/promise');

let connection;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'pharmacy'
    });
    
    console.log('✅ MySQL Connected Successfully');
    
    // Create tables if they don't exist
    await createTables();
    
    return connection;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    // Create products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        batch VARCHAR(100) NOT NULL,
        quantity INT DEFAULT 0,
        mrp DECIMAL(10,2) NOT NULL,
        gst DECIMAL(5,2) DEFAULT 0,
        costPrice DECIMAL(10,2) DEFAULT 0,
        expiryDate DATE NULL,
        category ENUM('Medicine', 'Supplement', 'Medical Equipment', 'Other') DEFAULT 'Medicine',
        manufacturer VARCHAR(255) NULL,
        minStockLevel INT DEFAULT 10,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_batch (batch),
        INDEX idx_category (category),
        INDEX idx_quantity (quantity),
        INDEX idx_expiry (expiryDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create bills table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        billNumber VARCHAR(50) NOT NULL UNIQUE,
        customerName VARCHAR(255) NOT NULL,
        customerPhone VARCHAR(20) NOT NULL,
        medicines JSON NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        gst DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        paymentMode ENUM('cash', 'credit', 'upi', 'card') DEFAULT 'cash',
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_billNumber (billNumber),
        INDEX idx_customerPhone (customerPhone),
        INDEX idx_createdAt (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create purchase_orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        supplierName VARCHAR(255) NOT NULL,
        supplierInvoiceNumber VARCHAR(100) NOT NULL UNIQUE,
        orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        items JSON NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'received', 'cancelled') DEFAULT 'pending',
        notes TEXT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_supplierInvoice (supplierInvoiceNumber),
        INDEX idx_status (status),
        INDEX idx_orderDate (orderDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ Database tables created/verified successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
};

const getConnection = () => {
  if (!connection) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return connection;
};

module.exports = { connectDB, getConnection };
