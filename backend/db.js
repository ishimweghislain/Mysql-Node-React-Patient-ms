const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
host: process.env.DATABASE_HOST || 'localhost',
user: process.env.DATABASE_USER || 'root',
password: process.env.DATABASE_PASSWORD || '',
database: 'hms_db'
});

db.connect((err) => {
if (err) {
console.error('Database connection failed:', err.message);
return;
}
console.log('Connected to MySQL database hms_db');
});

module.exports = db;