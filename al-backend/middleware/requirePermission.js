const { hasPermission } = require('../config/permissions');

// Must run after authenticate; separate organization and resource-scope checks
// are also required before this can authorize a business endpoint.
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (!hasPermission(req.user.roleName, permission)) return res.status(403).json({ message: 'Access denied' });
    return next();
  };
}

module.exports = { requirePermission };
