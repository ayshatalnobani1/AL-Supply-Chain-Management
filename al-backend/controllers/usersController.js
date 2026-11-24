const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// The identity was loaded from Oracle by the session authentication middleware.
exports.getSelf = (req, res) => {
  res.set('Cache-Control', 'no-store');
  const { userId, username, fullName, roleId, roleName, companyId, companyName, companyType, verifiedCompanyType } = req.user;
  res.json({ userId, username, fullName, roleId, roleName, companyId, companyName, companyType, verifiedCompanyType });
};

// The company ID comes only from the authenticated Oracle identity.
exports.getCompanyUsers = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT u.user_id AS "userId", u.username AS "username", u.full_name AS "fullName",
              u.role_id AS "roleId", r.role_name AS "roleName"
       FROM users u LEFT JOIN roles r ON r.role_id = u.role_id
       WHERE u.company_id = :companyId ORDER BY u.user_id`,
      { companyId: req.user.companyId }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.set('Cache-Control', 'no-store');
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch company users' });
  } finally {
    if (connection) await connection.close();
  }
};

// GET all users
exports.getAllUsers = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT user_id AS "userId", username AS "username", full_name AS "fullName",
              email AS "email", phone_number AS "phoneNumber", role_id AS "roleId",
              company_type AS "companyType", company_id AS "companyId" FROM users`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch users');
  } finally {
    if (connection) await connection.close();
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT user_id AS "userId", username AS "username", full_name AS "fullName",
              email AS "email", phone_number AS "phoneNumber", role_id AS "roleId",
              company_type AS "companyType", company_id AS "companyId"
       FROM users WHERE user_id = :id`,
      [req.params.id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch user');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new user
exports.createUser = async (req, res) => {
  const { username, password, role_id } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO users (user_id, username, password, role_id)
       VALUES (users_seq.NEXTVAL, :username, :password, :role_id)`,
      { username, password, role_id },
      { autoCommit: true }
    );
    res.status(201).send('User created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create user');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  const { username, password, role_id } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE users
       SET username = :username, password = :password, role_id = :role_id
       WHERE user_id = :id`,
      { username, password, role_id, id },
      { autoCommit: true }
    );
    res.send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update user');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM users WHERE user_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('User deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete user');
  } finally {
    if (connection) await connection.close();
  }
};
