const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

const checkRole = (role) => (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

module.exports = { checkAuth, checkRole };