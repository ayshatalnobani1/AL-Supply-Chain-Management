const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all product images
exports.getAllProductImages = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT image_id AS "imageId", product_id AS "productId", image_url AS "imageUrl"
       FROM product_images`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch product images');
  } finally {
    if (connection) await connection.close();
  }
};

// GET product image by ID
exports.getProductImageById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT image_id AS "imageId", product_id AS "productId", image_url AS "imageUrl"
       FROM product_images WHERE image_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch product image');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new product image
exports.createProductImage = async (req, res) => {
  const { product_id, image_url } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO product_images 
       (image_id, product_id, image_url) 
       VALUES (product_images_seq.NEXTVAL, :product_id, :image_url)`,
      { product_id, image_url },
      { autoCommit: true }
    );
    res.status(201).send('Product image created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create product image');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE product image
exports.updateProductImage = async (req, res) => {
  const { product_id, image_url } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE product_images 
       SET product_id = :product_id,
           image_url = :image_url
       WHERE image_id = :id`,
      { product_id, image_url, id },
      { autoCommit: true }
    );
    res.send('Product image updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update product image');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE product image
exports.deleteProductImage = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM product_images WHERE image_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Product image deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete product image');
  } finally {
    if (connection) await connection.close();
  }
};
