const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all inventory movements
exports.getAllInventoryMovements = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT movement_id AS "movementId", product_id AS "productId", warehouse_id AS "warehouseId",
              movement_type AS "movementType", quantity AS "quantity", movement_date AS "movementDate",
              movement_reason AS "movementReason", supplier_order_id AS "supplierOrderId"
       FROM inventory_movements`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch inventory movements');
  } finally {
    if (connection) await connection.close();
  }
};

// GET inventory movement by ID
exports.getInventoryMovementById = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT movement_id AS "movementId", product_id AS "productId", warehouse_id AS "warehouseId",
              movement_type AS "movementType", quantity AS "quantity", movement_date AS "movementDate",
              movement_reason AS "movementReason", supplier_order_id AS "supplierOrderId"
       FROM inventory_movements WHERE movement_id = :id`,
      [req.params.id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch inventory movement');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new inventory movement
exports.createInventoryMovement = async (req, res) => {
  const { product_id, warehouse_id, movement_type, quantity, movement_date } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO inventory_movements (movement_id, product_id, warehouse_id, movement_type, quantity, movement_date)
       VALUES (inventory_movements_seq.NEXTVAL, :product_id, :warehouse_id, :movement_type, :quantity, TO_DATE(:movement_date, 'YYYY-MM-DD'))`,
      { product_id, warehouse_id, movement_type, quantity, movement_date },
      { autoCommit: true }
    );
    res.status(201).send('Inventory movement created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create inventory movement');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE inventory movement
exports.updateInventoryMovement = async (req, res) => {
  const { product_id, warehouse_id, movement_type, quantity, movement_date } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE inventory_movements
       SET product_id = :product_id, warehouse_id = :warehouse_id, movement_type = :movement_type,
           quantity = :quantity, movement_date = TO_DATE(:movement_date, 'YYYY-MM-DD')
       WHERE movement_id = :id`,
      { product_id, warehouse_id, movement_type, quantity, movement_date, id },
      { autoCommit: true }
    );
    res.send('Inventory movement updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update inventory movement');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE inventory movement
exports.deleteInventoryMovement = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM inventory_movements WHERE movement_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Inventory movement deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete inventory movement');
  } finally {
    if (connection) await connection.close();
  }
};
