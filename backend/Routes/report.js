module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    // Middleware to check if user is Doctor or Admin
    const checkAccess = (req, res, next) => {
        if (req.session.user && (req.session.user.role === 'Doctor' || req.session.user.role === 'Admin')) {
            next();
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    };

    // Create Report
    router.post('/', checkAccess, (req, res) => {
        const { patient_id, doctor_id, date, findings } = req.body;
        db.query(
            'INSERT INTO Reports (Patient_ID, Doctor_ID, Date, Findings) VALUES (?, ?, ?, ?)',
            [patient_id, doctor_id, date, findings],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Report created', id: results.insertId });
            }
        );
    });

    // Read All Reports
    router.get('/', checkAccess, (req, res) => {
        db.query(
            'SELECT r.*, p.Name AS Patient_Name, d.Name AS Doctor_Name FROM Reports r ' +
            'JOIN Patients p ON r.Patient_ID = p.ID ' +
            'JOIN Doctors d ON r.Doctor_ID = d.ID',
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            }
        );
    });

    // Update Report
    router.put('/:id', checkAccess, (req, res) => {
        const { patient_id, doctor_id, date, findings } = req.body;
        db.query(
            'UPDATE Reports SET Patient_ID = ?, Doctor_ID = ?, Date = ?, Findings = ? WHERE ID = ?',
            [patient_id, doctor_id, date, findings, req.params.id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Report updated' });
            }
        );
    });

    // Delete Report
    router.delete('/:id', checkAccess, (req, res) => {
        db.query('DELETE FROM Reports WHERE ID = ?', [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Report deleted' });
        });
    });

    // Monthly Report
    router.get('/monthly', checkAccess, (req, res) => {
        const { year, month } = req.query;
        db.query(
            'SELECT r.*, p.Name AS Patient_Name, d.Name AS Doctor_Name FROM Reports r ' +
            'JOIN Patients p ON r.Patient_ID = p.ID ' +
            'JOIN Doctors d ON r.Doctor_ID = d.ID ' +
            'WHERE YEAR(r.Date) = ? AND MONTH(r.Date) = ?',
            [year, month],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            }
        );
    });

    return router;
};