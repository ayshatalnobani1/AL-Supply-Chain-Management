const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all supplier orders
exports.getAllSupplierOrders = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT supplier_order_id AS "supplierOrderId", user_id AS "userId", order_date AS "orderDate",
              status AS "status", total_amount AS "totalAmount", status_id AS "statusId",
              product_id AS "productId", company_id AS "companyId", quantity AS "quantity"
       FROM supplier_orders`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch supplier orders');
  } finally {
    if (connection) await connection.close();
  }
};

// GET supplier order by ID
exports.getSupplierOrderById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT supplier_order_id AS "supplierOrderId", user_id AS "userId", order_date AS "orderDate",
              status AS "status", total_amount AS "totalAmount", status_id AS "statusId",
              product_id AS "productId", company_id AS "companyId", quantity AS "quantity"
       FROM supplier_orders WHERE supplier_order_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch supplier order');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new supplier order
exports.createSupplierOrder = async (req, res) => {
  const { product_id, supplier_id, quantity, order_date, user_id } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO supplier_orders (order_id, product_id, supplier_id, quantity, order_date, user_id)
       VALUES (supplier_orders_seq.NEXTVAL, :product_id, :supplier_id, :quantity, TO_DATE(:order_date, 'YYYY-MM-DD'), :user_id)`,
      { product_id, supplier_id, quantity, order_date, user_id },
      { autoCommit: true }
    );
    res.status(201).send('Supplier order created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create supplier order');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE supplier order
exports.updateSupplierOrder = async (req, res) => {
  const { product_id, supplier_id, quantity, order_date, user_id } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE supplier_orders
       SET product_id = :product_id,
           supplier_id = :supplier_id,
           quantity = :quantity,
           order_date = TO_DATE(:order_date, 'YYYY-MM-DD'),
           user_id = :user_id
       WHERE order_id = :id`,
      { product_id, supplier_id, quantity, order_date, user_id, id },
      { autoCommit: true }
    );
    res.send('Supplier order updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update supplier order');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE supplier order
exports.deleteSupplierOrder = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM supplier_orders WHERE order_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Supplier order deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete supplier order');
  } finally {
    if (connection) await connection.close();
  }
};
