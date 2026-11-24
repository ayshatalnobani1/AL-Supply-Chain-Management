const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all order statuses
exports.getAllOrderStatuses = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT status_id AS "statusId", status_name AS "statusName" FROM order_status`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch order statuses');
  } finally {
    if (connection) await connection.close();
  }
};

// GET order status by ID
exports.getOrderStatusById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT status_id AS "statusId", status_name AS "statusName"
       FROM order_status WHERE status_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch order status');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new order status
exports.createOrderStatus = async (req, res) => {
  const { status_name, description } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO order_status 
       (status_id, status_name, description) 
       VALUES (order_status_seq.NEXTVAL, :status_name, :description)`,
      { status_name, description },
      { autoCommit: true }
    );
    res.status(201).send('Order status created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create order status');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE order status
exports.updateOrderStatus = async (req, res) => {
  const { status_name, description } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE order_status 
       SET status_name = :status_name,
           description = :description
       WHERE status_id = :id`,
      { status_name, description, id },
      { autoCommit: true }
    );
    res.send('Order status updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update order status');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE order status
exports.deleteOrderStatus = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM order_status WHERE status_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Order status deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete order status');
  } finally {
    if (connection) await connection.close();
  }
};
