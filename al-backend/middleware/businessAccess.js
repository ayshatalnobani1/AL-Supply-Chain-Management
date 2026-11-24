// Temporary read-only policy. These IDs are explicit local-development grants,
// independent of the user's role and never enabled in production.
const configuredIds = (process.env.DEV_ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
if (configuredIds.some(id => !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id)))) {
  throw new Error('DEV_ADMIN_USER_IDS must be a comma-separated list of positive user IDs.');
}
const developmentAdminIds = new Set(configuredIds);

function requireOrganization(req, res, next) {
  if (req.user.companyId == null || !['company', 'supplier'].includes(req.user.verifiedCompanyType)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}

function readOnly(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ message: 'Business mutations are temporarily unavailable' });
  }
  next();
}

function requireDevelopmentAdmin(req, res, next) {
  if (process.env.NODE_ENV === 'production' || !developmentAdminIds.has(String(req.user.userId))) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}

function denyRestrictedReads(_req, res) {
  return res.status(403).json({ message: 'Access denied' });
}

module.exports = { requireOrganization, readOnly, requireDevelopmentAdmin, denyRestrictedReads };
