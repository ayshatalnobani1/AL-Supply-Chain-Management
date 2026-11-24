const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all payments
exports.getAllPayments = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT payment_id AS "paymentId", supplier_order_id AS "supplierOrderId", amount AS "amount",
              payment_date AS "paymentDate", payment_method AS "paymentMethod",
              payment_status AS "paymentStatus" FROM payments`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch payments');
  } finally {
    if (connection) await connection.close();
  }
};

// GET payment by ID
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT payment_id AS "paymentId", supplier_order_id AS "supplierOrderId", amount AS "amount",
              payment_date AS "paymentDate", payment_method AS "paymentMethod",
              payment_status AS "paymentStatus" FROM payments WHERE payment_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch payment');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new payment
exports.createPayment = async (req, res) => {
  const { order_id, amount, payment_date, method } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO payments (payment_id, order_id, amount, payment_date, method)
       VALUES (payments_seq.NEXTVAL, :order_id, :amount, TO_DATE(:payment_date, 'YYYY-MM-DD'), :method)`,
      { order_id, amount, payment_date, method },
      { autoCommit: true }
    );
    res.status(201).send('Payment created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create payment');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE payment
exports.updatePayment = async (req, res) => {
  const { order_id, amount, payment_date, method } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE payments
       SET order_id = :order_id,
           amount = :amount,
           payment_date = TO_DATE(:payment_date, 'YYYY-MM-DD'),
           method = :method
       WHERE payment_id = :id`,
      { order_id, amount, payment_date, method, id },
      { autoCommit: true }
    );
    res.send('Payment updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update payment');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE payment
exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM payments WHERE payment_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Payment deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete payment');
  } finally {
    if (connection) await connection.close();
  }
};
