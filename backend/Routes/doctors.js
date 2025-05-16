module.exports = (db) => {
    const express = require('express');
    const router = express.Router();

    // Middleware to check if user is Admin
    const checkAdmin = (req, res, next) => {
        if (req.session.user && req.session.user.role === 'Admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    };

    // Create Doctor
    router.post('/', checkAdmin, (req, res) => {
        const { name, specialization, phone_number, email } = req.body;
        db.query(
            'INSERT INTO Doctors (Name, Specialization, Phone_Number, Email) VALUES (?, ?, ?, ?)',
            [name, specialization, phone_number, email],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Doctor created', id: results.insertId });
            }
        );
    });

    // Read All Doctors
    router.get('/', (req, res) => {
        db.query('SELECT * FROM Doctors', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });

    // Update Doctor
    router.put('/:id', checkAdmin, (req, res) => {
        const { name, specialization, phone_number, email } = req.body;
        db.query(
            'UPDATE Doctors SET Name = ?, Specialization = ?, Phone_Number = ?, Email = ? WHERE ID = ?',
            [name, specialization, phone_number, email, req.params.id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Doctor updated' });
            }
        );
    });

    // Delete Doctor
    router.delete('/:id', checkAdmin, (req, res) => {
        db.query('DELETE FROM Doctors WHERE ID = ?', [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Doctor deleted' });
        });
    });

    return router;
};