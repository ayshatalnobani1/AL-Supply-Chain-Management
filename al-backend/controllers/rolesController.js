const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

exports.getAllRoles = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT role_id AS "roleId", role_name AS "roleName", description AS "description" FROM roles`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch roles');
  } finally {
    if (connection) await connection.close();
  }
};

exports.getRoleById = async (req, res) => {
  let connection;
  const { id } = req.params;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT role_id AS "roleId", role_name AS "roleName", description AS "description"
       FROM roles WHERE role_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch role by ID');
  } finally {
    if (connection) await connection.close();
  }
};

exports.createRole = async (req, res) => {
  let connection;
  const { role_name } = req.body;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO roles (role_id, role_name)
       VALUES (roles_seq.NEXTVAL, :role_name)`,
      [role_name],
      { autoCommit: true }
    );
    res.status(201).send('Role created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create role');
  } finally {
    if (connection) await connection.close();
  }
};

exports.updateRole = async (req, res) => {
  let connection;
  const { id } = req.params;
  const { role_name } = req.body;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE roles SET role_name = :role_name WHERE role_id = :id`,
      [role_name, id],
      { autoCommit: true }
    );
    res.send('Role updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update role');
  } finally {
    if (connection) await connection.close();
  }
};

exports.deleteRole = async (req, res) => {
  let connection;
  const { id } = req.params;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `DELETE FROM roles WHERE role_id = :id`,
      [id],
      { autoCommit: true }
    );
    res.send('Role deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete role');
  } finally {
    if (connection) await connection.close();
  }
};
