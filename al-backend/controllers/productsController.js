const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

exports.getAllProducts = async (req, res) => {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT product_id AS "productId", product_name AS "productName",
              product_category AS "productCategory", price AS "price",
              stock_quantity AS "stockQuantity", expiry_date AS "expiryDate",
              is_active AS "isActive", warehouse_id AS "warehouseId",
              company_id AS "companyId" FROM products`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch products');
  } finally {
    if (connection) await connection.close();
  }
};

exports.getProductById = async (req, res) => {
  let connection;
  const { id } = req.params;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT product_id AS "productId", product_name AS "productName",
              product_category AS "productCategory", price AS "price",
              stock_quantity AS "stockQuantity", expiry_date AS "expiryDate",
              is_active AS "isActive", warehouse_id AS "warehouseId",
              company_id AS "companyId" FROM products WHERE product_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch product by ID');
  } finally {
    if (connection) await connection.close();
  }
};

exports.createProduct = async (req, res) => {
  let connection;
  const { name, category, price, stock_quantity } = req.body;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO products (product_id, name, category, price, stock_quantity)
       VALUES (products_seq.NEXTVAL, :name, :category, :price, :stock_quantity)`,
      [name, category, price, stock_quantity],
      { autoCommit: true }
    );
    res.status(201).send('Product created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create product');
  } finally {
    if (connection) await connection.close();
  }
};

exports.updateProduct = async (req, res) => {
  let connection;
  const { id } = req.params;
  const { name, category, price, stock_quantity } = req.body;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE products SET name = :name, category = :category, price = :price, stock_quantity = :stock_quantity
       WHERE product_id = :id`,
      [name, category, price, stock_quantity, id],
      { autoCommit: true }
    );
    res.send('Product updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update product');
  } finally {
    if (connection) await connection.close();
  }
};

exports.deleteProduct = async (req, res) => {
  let connection;
  const { id } = req.params;

  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM products WHERE product_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Product deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete product');
  } finally {
    if (connection) await connection.close();
  }
};
