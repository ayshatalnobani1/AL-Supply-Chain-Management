const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all productions
exports.getAllProductions = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT production_id AS "productionId", product_id AS "productId",
              production_date AS "productionDate", quantity AS "quantity", recipe_id AS "recipeId"
       FROM productions`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch productions');
  } finally {
    if (connection) await connection.close();
  }
};

// GET production by ID
exports.getProductionById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT production_id AS "productionId", product_id AS "productId",
              production_date AS "productionDate", quantity AS "quantity", recipe_id AS "recipeId"
       FROM productions WHERE production_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch production');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new production
exports.createProduction = async (req, res) => {
  const { product_id, quantity_produced, production_date } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO productions (production_id, product_id, quantity_produced, production_date)
       VALUES (productions_seq.NEXTVAL, :product_id, :quantity_produced, TO_DATE(:production_date, 'YYYY-MM-DD'))`,
      { product_id, quantity_produced, production_date },
      { autoCommit: true }
    );
    res.status(201).send('Production record created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create production record');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE production
exports.updateProduction = async (req, res) => {
  const { product_id, quantity_produced, production_date } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE productions
       SET product_id = :product_id,
           quantity_produced = :quantity_produced,
           production_date = TO_DATE(:production_date, 'YYYY-MM-DD')
       WHERE production_id = :id`,
      { product_id, quantity_produced, production_date, id },
      { autoCommit: true }
    );
    res.send('Production record updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update production record');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE production
exports.deleteProduction = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM productions WHERE production_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Production record deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete production record');
  } finally {
    if (connection) await connection.close();
  }
};
