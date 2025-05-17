const requireAuth = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }
    next();
  };
  
  const requireRole = (role) => (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: ${role} access required` });
    }
    next();
  };
  
  module.exports = { requireAuth, requireRole };