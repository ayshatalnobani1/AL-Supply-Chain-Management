const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// Multiple profile rows are possible; do not choose one or trust a client ID.
exports.getSelfProfiles = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT profile_id AS "profileId", user_id AS "userId", full_name AS "fullName",
              company_name AS "companyName", contact_number AS "contactNumber",
              address AS "address", image_url AS "imageUrl"
       FROM user_profiles WHERE user_id = :userId ORDER BY profile_id`,
      { userId: req.user.userId }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.set('Cache-Control', 'no-store');
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch profiles' });
  } finally {
    if (connection) await connection.close();
  }
};

// GET all user profiles
exports.getAllUserProfiles = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT profile_id AS "profileId", user_id AS "userId", full_name AS "fullName",
              company_name AS "companyName", contact_number AS "contactNumber",
              address AS "address", image_url AS "imageUrl" FROM user_profiles`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch user profiles');
  } finally {
    if (connection) await connection.close();
  }
};

// GET user profile by ID
exports.getUserProfileById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT profile_id AS "profileId", user_id AS "userId", full_name AS "fullName",
              company_name AS "companyName", contact_number AS "contactNumber",
              address AS "address", image_url AS "imageUrl"
       FROM user_profiles WHERE profile_id = :id`,
      [id], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch user profile');
  } finally {
    if (connection) await connection.close();
  }
};

// CREATE user profile
exports.createUserProfile = async (req, res) => {
  const { user_id, full_name, company_name, contact_number, address, image_url } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO user_profiles 
       (profile_id, user_id, full_name, company_name, contact_number, address, image_url) 
       VALUES (user_profiles_seq.NEXTVAL, :user_id, :full_name, :company_name, :contact_number, :address, :image_url)`,
      { user_id, full_name, company_name, contact_number, address, image_url },
      { autoCommit: true }
    );
    res.status(201).send('User profile created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create user profile');
  } finally {
    if (connection) await connection.close();
  }
};

// UPDATE user profile
exports.updateUserProfile = async (req, res) => {
  const { full_name, company_name, contact_number, address, image_url } = req.body;
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE user_profiles 
       SET full_name = :full_name,
           company_name = :company_name,
           contact_number = :contact_number,
           address = :address,
           image_url = :image_url
       WHERE profile_id = :id`,
      { full_name, company_name, contact_number, address, image_url, id },
      { autoCommit: true }
    );
    res.send('User profile updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update user profile');
  } finally {
    if (connection) await connection.close();
  }
};

// DELETE user profile
exports.deleteUserProfile = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      'DELETE FROM user_profiles WHERE profile_id = :id',
      [id],
      { autoCommit: true }
    );
    res.send('User profile deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete user profile');
  } finally {
    if (connection) await connection.close();
  }
};
