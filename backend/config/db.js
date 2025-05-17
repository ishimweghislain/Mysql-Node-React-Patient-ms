const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'khosp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisify pool for async/await
const db = pool.promise();

// Initialize database and tables
async function initializeDatabase() {
  try {
    // Create database if not exists
    await db.query(`CREATE DATABASE IF NOT EXISTS khosp`);
    await db.query(`USE khosp`);

    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'doctor') NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Create doctors table
    await db.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        email VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Create patients table
    await db.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        phone_number VARCHAR(20),
        address TEXT,
        sex ENUM('M', 'F', 'Other') NOT NULL
      )
    `);

    // Create reports table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        date DATE NOT NULL,
        findings TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    // Insert initial admin user
    const adminPassword = bcrypt.hashSync('admin123', 10);
    await db.query(
      'INSERT IGNORE INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
      ['admin', adminPassword, 'admin', 'admin@kobutare.com']
    );

    // Invert sample doctors
    await db.query(
      'INSERT IGNORE INTO doctors (name, specialization, phone_number, email) VALUES (?, ?, ?, ?)',
      ['Dr. John Doe', 'Cardiology', '+250123456789', 'john.doe@kobutare.com']
    );
    await db.query(
      'INSERT IGNORE INTO doctors (name, specialization, phone_number, email) VALUES (?, ?, ?, ?)',
      ['Dr. Jane Smith', 'Neurology', '+250987654321', 'jane.smith@kobutare.com']
    );

    console.log('Database and tables initialized with initial data');
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
}

// Run initialization
initializeDatabase();

module.exports = db;