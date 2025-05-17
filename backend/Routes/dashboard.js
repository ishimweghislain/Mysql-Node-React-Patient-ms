const express = require('express');
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Admin dashboard metrics
router.get('/admin', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [doctorCount] = await db.query('SELECT COUNT(*) as count FROM doctors');
    const [recentUsers] = await db.query(
      'SELECT username, role, email, id FROM users ORDER BY id DESC LIMIT 5'
    );
    const [recentDoctors] = await db.query(
      'SELECT name, specialization, email, id FROM doctors ORDER BY id DESC LIMIT 5'
    );

    res.json({
      totalUsers: userCount[0].count,
      totalDoctors: doctorCount[0].count,
      recentUsers,
      recentDoctors,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Doctor dashboard metrics
router.get('/doctor', requireAuth, requireRole('doctor'), async (req, res) => {
  try {
    const [patientCount] = await db.query('SELECT COUNT(*) as count FROM patients');
    const [reportCount] = await db.query('SELECT COUNT(*) as count FROM reports WHERE doctor_id = ?', [req.session.user.id]);
    const [recentPatients] = await db.query(
      'SELECT name, date_of_birth, sex, id FROM patients ORDER BY id DESC LIMIT 5'
    );
    const [recentReports] = await db.query(
      `SELECT r.id, r.date, r.findings, p.name as patient_name
       FROM reports r
       JOIN patients p ON r.patient_id = p.id
       WHERE r.doctor_id = ?
       ORDER BY r.date DESC LIMIT 5`,
      [req.session.user.id]
    );

    res.json({
      totalPatients: patientCount[0].count,
      totalReports: reportCount[0].count,
      recentPatients,
      recentReports,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;