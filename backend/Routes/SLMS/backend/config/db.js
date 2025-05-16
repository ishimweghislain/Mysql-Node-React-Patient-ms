const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'smart_library'
});
connection.connect((err) => {
    if (err) console.error('Database connection error:', err);
    else console.log('Connected to MySQL');
});
module.exports = connection;