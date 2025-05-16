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

    // Create Patient
    router.post('/', checkAccess, (req, res) => {
        const { name, date_of_birth, phone_number, address, sex } = req.body;
        db.query(
            'INSERT INTO Patients (Name, Date_of_Birth, Phone_Number, Address, Sex) VALUES (?, ?, ?, ?, ?)',
            [name, date_of_birth, phone_number, address, sex],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Patient created', id: results.insertId });
            }
        );
    });

    // Read All Patients
    router.get('/', checkAccess, (req, res) => {
        db.query('SELECT * FROM Patients', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });

    // Update Patient
    router.put('/:id', checkAccess, (req, res) => {
        const { name, date_of_birth, phone_number, address, sex } = req.body;
        db.query(
            'UPDATE Patients SET Name = ?, Date_of_Birth = ?, Phone_Number = ?, Address = ?, Sex = ? WHERE ID = ?',
            [name, date_of_birth, phone_number, address, sex, req.params.id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Patient updated' });
            }
        );
    });

    // Delete Patient
    router.delete('/:id', checkAccess, (req, res) => {
        db.query('DELETE FROM Patients WHERE ID = ?', [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Patient deleted' });
        });
    });

    return router;
};