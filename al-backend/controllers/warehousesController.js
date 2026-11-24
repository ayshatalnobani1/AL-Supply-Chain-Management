const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all warehouses
exports.getAllWarehouses = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT warehouse_id AS "warehouseId", warehouse_location AS "warehouseLocation",
              capacity AS "capacity", manager AS "manager" FROM warehouses`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch warehouses');
  } finally {
    if (connection) await connection.close();
  }
};

// GET warehouse by ID
exports.getWarehouseById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT warehouse_id AS "warehouseId", warehouse_location AS "warehouseLocation",
              capacity AS "capacity", manager AS "manager" FROM warehouses WHERE warehouse_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch warehouse');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new warehouse
exports.createWarehouse = async (req, res) => {
  const { location } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO warehouses (warehouse_id, location)
       VALUES (warehouses_seq.NEXTVAL, :location)`,
      { location },
      { autoCommit: true }
    );
    res.status(201).send('Warehouse created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create warehouse');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE warehouse
exports.updateWarehouse = async (req, res) => {
  const { location } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE warehouses
       SET location = :location
       WHERE warehouse_id = :id`,
      { location, id },
      { autoCommit: true }
    );
    res.send('Warehouse updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update warehouse');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE warehouse
exports.deleteWarehouse = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM warehouses WHERE warehouse_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Warehouse deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete warehouse');
  } finally {
    if (connection) await connection.close();
  }
};
