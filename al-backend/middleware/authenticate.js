const oracledb = require('oracledb');
const { dbConfig } = require('../config/environment');
const { cookieName, verifySession } = require('../utils/session');

module.exports = async (req, res, next) => {
  const cookies = (req.headers.cookie || '').split(';').map(part => part.trim());
  const matches = cookies.filter(part => part.startsWith(`${cookieName}=`));
  let userId;
  try {
    if (matches.length !== 1) throw new Error('Missing or ambiguous cookie');
    userId = verifySession(decodeURIComponent(matches[0].slice(cookieName.length + 1)));
  } catch {
    return res.status(401).json({ message: 'Authentication required' });
  }
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT u.user_id AS "userId", u.username AS "username", u.full_name AS "fullName",
              u.email AS "email", u.phone_number AS "phoneNumber", u.role_id AS "roleId",
              r.role_name AS "roleName", u.company_type AS "companyType", u.company_id AS "companyId",
              c.company_name AS "companyName", c.company_type AS "verifiedCompanyType"
       FROM users u LEFT JOIN roles r ON r.role_id = u.role_id
       LEFT JOIN companies c ON c.company_id = u.company_id WHERE u.user_id = :userId`,
      { userId: Number(userId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length !== 1) return res.status(401).json({ message: 'Authentication required' });
    req.user = result.rows[0];
    return next();
  } catch {
    return res.status(500).json({ message: 'Authentication unavailable' });
  } finally {
    if (connection) await connection.close();
  }
};
