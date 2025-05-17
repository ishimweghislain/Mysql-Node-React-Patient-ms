const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, username: user.username, role: user.role, email: user.email };
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logout successful' });
  });
});

// Admin: Register any user
router.post('/register', requireAuth, requireRole('admin'), async (req, res) => {
  const { username, password, role, email } = req.body;
  if (!username || !password || !role || !email) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (!['admin', 'doctor' ,'staff'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.query(
      'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, email]
    );
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

// Doctor: Self-register by selecting existing doctor
router.post('/register-doctor', async (req, res) => {
  const { doctorId, username, password } = req.body;
  if (!doctorId || !username || !password) {
    return res.status(400).json({ error: 'Doctor ID, username, and password required' });
  }

  try {
    const [doctorRows] = await db.query('SELECT * FROM doctors WHERE id = ?', [doctorId]);
    const doctor = doctorRows[0];
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    await db.query(
      'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, 'doctor', doctor.email]
    );
    res.json({ message: 'Doctor registered' });
  } catch (err) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

// Get available doctors for self-registration
router.get('/doctors', async (req, res) => {
  try {
    const [doctors] = await db.query('SELECT id, name, email FROM doctors');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;