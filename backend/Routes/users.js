module.exports = (db) => {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcryptjs');

    // Middleware to check if user is Admin
    const checkAdmin = (req, res, next) => {
        if (req.session.user && req.session.user.role === 'Admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    };

    // Create User
    router.post('/', async (req, res) => {
        const { username, password, role, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            'INSERT INTO Users (Username, Password, Role, Email) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, role, email],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'User created', id: results.insertId });
            }
        );
    });

    // Read All Users
    router.get('/', checkAdmin, (req, res) => {
        db.query('SELECT ID, Username, Role, Email FROM Users', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });

    // Update User
    router.put('/:ID', checkAdmin, async (req, res) => {
        const { username, password, role, email } = req.body;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const query = password
            ? 'UPDATE Users SET Username = ?, Password = ?, Role = ?, Email = ? WHERE ID = ?'
            : 'UPDATE Users SET Username = ?, Role = ?, Email = ? WHERE ID = ?';
        const params = password
            ? [username, hashedPassword, Role, Email, req.params.ID]
            : [username, Role, Email, req.params.ID];
        db.query(query, params, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User updated' });
        });
    });

    // Delete User
    router.delete('/:id', checkAdmin, (req, res) => {
        db.query('DELETE FROM Users WHERE ID = ?', [req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User deleted' });
        });
    });

    return router;
};