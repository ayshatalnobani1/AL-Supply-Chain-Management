const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// GET all production recipes
exports.getAllProductionRecipes = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT recipe_id AS "recipeId", recipe_name AS "recipeName", ingredients AS "ingredients",
              preparation_method AS "preparationMethod" FROM production_recipes`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch production recipes');
  } finally {
    if (connection) await connection.close();
  }
};

// GET recipe by ID
exports.getRecipeById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT recipe_id AS "recipeId", recipe_name AS "recipeName", ingredients AS "ingredients",
              preparation_method AS "preparationMethod" FROM production_recipes WHERE recipe_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch recipe');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE new recipe
exports.createRecipe = async (req, res) => {
  const { product_id, ingredient_name, quantity_required } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO production_recipes (recipe_id, product_id, ingredient_name, quantity_required)
       VALUES (production_recipes_seq.NEXTVAL, :product_id, :ingredient_name, :quantity_required)`,
      { product_id, ingredient_name, quantity_required },
      { autoCommit: true }
    );
    res.status(201).send('Production recipe created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create recipe');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE recipe
exports.updateRecipe = async (req, res) => {
  const { product_id, ingredient_name, quantity_required } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE production_recipes
       SET product_id = :product_id,
           ingredient_name = :ingredient_name,
           quantity_required = :quantity_required
       WHERE recipe_id = :id`,
      { product_id, ingredient_name, quantity_required, id },
      { autoCommit: true }
    );
    res.send('Production recipe updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update recipe');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE recipe
exports.deleteRecipe = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM production_recipes WHERE recipe_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('Production recipe deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete recipe');
  } finally {
    if (connection) await connection.close();
  }
};
