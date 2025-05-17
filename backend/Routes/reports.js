const express = require('express');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get reports by patient ID
router.get('/patient/:patientId', requireAuth, requireRole('doctor'), async (req, res) => {
  const { patientId } = req.params;
  try {
    const [reports] = await db.query(
      `SELECT r.id, r.date, r.findings, d.name as doctor_name, p.name as patient_name
       FROM reports r
       JOIN doctors d ON r.doctor_id = d.id
       JOIN patients p ON r.patient_id = p.id
       WHERE r.patient_id = ?`,
      [patientId]
    );
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create report
router.post('/', requireAuth, requireRole('doctor'), async (req, res) => {
  const { patient_id, findings } = req.body;
  const doctor_id = req.session.user.id; // Links to users.id
  if (!patient_id || !findings) {
    return res.status(400).json({ error: 'Patient ID and findings required' });
  }

  try {
    const date = new Date().toISOString().split('T')[0];
    await db.query(
      'INSERT INTO reports (patient_id, doctor_id, date, findings) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, date, findings]
    );
    res.json({ message: 'Report created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;