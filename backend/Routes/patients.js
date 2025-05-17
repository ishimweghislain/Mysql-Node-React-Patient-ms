const express = require('express');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all patients
router.get('/', requireAuth, requireRole('doctor'), async (req, res) => {
  try {
    const [patients] = await db.query('SELECT * FROM patients');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create patient
router.post('/', requireAuth, requireRole('doctor'), async (req, res) => {
  const { name, date_of_birth, phone_number, address, sex } = req.body;
  if (!name || !date_of_birth || !sex) {
    return res.status(400).json({ error: 'Name, date of birth, and sex required' });
  }
  if (!['M', 'F', 'Other'].includes(sex)) {
    return res.status(400).json({ error: 'Invalid sex' });
  }

  try {
    await db.query(
      'INSERT INTO patients (name, date_of_birth, phone_number, address, sex) VALUES (?, ?, ?, ?, ?)',
      [name, date_of_birth, phone_number, address, sex]
    );
    res.json({ message: 'Patient created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update patient
router.put('/:id', requireAuth, requireRole('doctor'), async (req, res) => {
  const { id } = req.params;
  const { name, date_of_birth, phone_number, address, sex } = req.body;
  if (!name || !date_of_birth || !sex) {
    return res.status(400).json({ error: 'Name, date of birth, and sex required' });
  }
  if (!['M', 'F', 'Other'].includes(sex)) {
    return res.status(400).json({ error: 'Invalid sex' });
  }

  try {
    await db.query(
      'UPDATE patients SET name = ?, date_of_birth = ?, phone_number = ?, address = ?, sex = ? WHERE id = ?',
      [name, date_of_birth, phone_number, address, sex, id]
    );
    res.json({ message: 'Patient updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete patient
router.delete('/:id', requireAuth, requireRole('doctor'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM patients WHERE id = ?', [id]);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;