const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all stock adjustments
exports.getAllStockAdjustments = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT adjustment_id AS "adjustmentId", product_id AS "productId",
              adjustment_date AS "adjustmentDate", quantity_adjusted AS "quantityAdjusted",
              reason AS "reason" FROM stock_adjustments`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch stock adjustments');
  } finally {
    if (connection) await connection.close();
  }
};

// GET stock adjustment by ID
exports.getStockAdjustmentById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT adjustment_id AS "adjustmentId", product_id AS "productId",
              adjustment_date AS "adjustmentDate", quantity_adjusted AS "quantityAdjusted",
              reason AS "reason" FROM stock_adjustments WHERE adjustment_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch stock adjustment');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new stock adjustment
exports.createStockAdjustment = async (req, res) => {
  const { product_id, warehouse_id, adjustment_type, quantity, adjustment_date } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO stock_adjustments 
       (adjustment_id, product_id, warehouse_id, adjustment_type, quantity, adjustment_date)
       VALUES (stock_adjustments_seq.NEXTVAL, :product_id, :warehouse_id, :adjustment_type, :quantity, TO_DATE(:adjustment_date, 'YYYY-MM-DD'))`,
      { product_id, warehouse_id, adjustment_type, quantity, adjustment_date },
      { autoCommit: true }
    );
    res.status(201).send('Stock adjustment created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create stock adjustment');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE stock adjustment
exports.updateStockAdjustment = async (req, res) => {
  const { product_id, warehouse_id, adjustment_type, quantity, adjustment_date } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE stock_adjustments
       SET product_id = :product_id,
           warehouse_id = :warehouse_id,
           adjustment_type = :adjustment_type,
           quantity = :quantity,
           adjustment_date = TO_DATE(:adjustment_date, 'YYYY-MM-DD')
       WHERE adjustment_id = :id`,
      { product_id, warehouse_id, adjustment_type, quantity, adjustment_date, id },
      { autoCommit: true }
    );
    res.send('Stock adjustment updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update stock adjustment');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE stock adjustment
exports.deleteStockAdjustment = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM stock_adjustments WHERE adjustment_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Stock adjustment deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete stock adjustment');
  } finally {
    if (connection) await connection.close();
  }
};
