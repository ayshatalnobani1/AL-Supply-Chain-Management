// controllers/authController.js
const oracledb = require('oracledb');
const { findMatchingAccounts } = require('../utils/passwordVerification');
const { dbConfig } = require('../config/environment');
const { cookieName, cookieOptions, legacyCookieOptions, lifetimeSeconds, signSession } = require('../utils/session');

exports.signup = (_req, res) => {
  res.status(503).json({ message: 'Registration is temporarily unavailable.' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body || {};
  let connection;

  try {
    if (typeof username !== 'string' || !username || typeof password !== 'string' || !password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT u.user_id AS "userId", u.username AS "username", u.full_name AS "fullName",
              u.email AS "email", u.phone_number AS "phoneNumber", u.role_id AS "roleId",
              r.role_name AS "roleName", u.company_type AS "companyType", u.company_id AS "companyId",
              c.company_name AS "companyName", c.company_type AS "verifiedCompanyType",
              u.user_password AS "storedPassword"
       FROM users u LEFT JOIN roles r ON r.role_id = u.role_id
       LEFT JOIN companies c ON c.company_id = u.company_id WHERE u.username = :username`,
      { username },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const matchingAccounts = await findMatchingAccounts(result.rows, password);

    if (matchingAccounts.length !== 1) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { storedPassword, ...user } = matchingAccounts[0];
    res.clearCookie(cookieName, legacyCookieOptions);
    res.cookie(cookieName, signSession(user.userId), { ...cookieOptions, maxAge: lifetimeSeconds * 1000 });
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(500).json({ message: 'Authentication failed' });
  } finally {
    if (connection) await connection.close();
  }
};

exports.me = (req, res) => res.json({ user: req.user });

// Clearing a stateless JWT cookie does not revoke copies of the token.
exports.logout = (_req, res) => {
  res.clearCookie(cookieName, cookieOptions);
  res.clearCookie(cookieName, legacyCookieOptions);
  res.json({ message: 'Logged out' });
};
