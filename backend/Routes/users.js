const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, role, email FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { username, password, role, email } = req.body;
  if (!username || !role || !email) {
    return res.status(400).json({ error: 'Username, role, and email required' });
  }
  if (!['admin', 'doctor', 'staff'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const updates = [];
    const values = [];
    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (password) {
      updates.push('password = ?');
      values.push(bcrypt.hashSync(password, 10));
    }
    if (role) {
      updates.push('role = ?');
      values.push(role);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    values.push(id);
    await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

// Delete user
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create doctor (admin only)
router.post('/doctors', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, specialization, phone_number, email } = req.body;
  if (!name || !specialization || !email) {
    return res.status(400).json({ error: 'Name, specialization, and email required' });
  }

  try {
    await db.query(
      'INSERT INTO doctors (name, specialization, phone_number, email) VALUES (?, ?, ?, ?)',
      [name, specialization, phone_number, email]
    );
    res.json({ message: 'Doctor created' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});




// Get all doctors (for admin management)
router.get('/doctors', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [doctors] = await db.query('SELECT * FROM doctors');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;