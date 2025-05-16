const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
    secret: 'hms_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'hms_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Import Routes
const patientRoutes = require('./routes/Patient');
const doctorRoutes = require('./routes/doctors');
const reportRoutes = require('./routes/report');
const userRoutes = require('./routes/Users');
const authRoutes = require('./routes/auth');

// Use Routes
app.use('/api/patients', patientRoutes(db));
app.use('/api/doctors', doctorRoutes(db));
app.use('/api/reports', reportRoutes(db));
app.use('/api/users', userRoutes(db));
app.use('/api', authRoutes(db, bcrypt));

app.listen(5000, () => console.log('Server running on port 5000'));