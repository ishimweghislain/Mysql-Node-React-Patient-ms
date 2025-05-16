module.exports = (db, bcrypt) => {
    const express = require('express');
    const router = express.Router();

    // Login
    router.post('/login', (req, res) => {
        const { username, password } = req.body;
        db.query('SELECT * FROM Users WHERE Username = ?', [username], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

            const user = results[0];
            const match = await bcrypt.compare(password, user.Password);
            if (!match) return res.status(401).json({ error: 'Invalid credentials' });

            req.session.user = { id: user.ID, username: user.Username, role: user.Role };
            res.json({ message: 'Login successful', user: req.session.user });
        });
    });

    // Logout
    router.post('/logout', (req, res) => {
        req.session.destroy();
        res.json({ message: 'Logout successful' });
    });

    // Check Session
    router.get('/check', (req, res) => {
        if (req.session.user) {
            res.json({ user: req.session.user });
        } else {
            res.status(401).json({ error: 'Not logged in' });
        }
    });

    return router;
};