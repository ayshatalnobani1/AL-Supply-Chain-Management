const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

// Supplier companies are represented by COMPANIES.COMPANY_TYPE = 'supplier'.
// This controller is a read-only directory; supplier mutations are not supported.
exports.getAllSuppliers = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT company_id AS "companyId", company_name AS "companyName",
              company_type AS "companyType"
       FROM companies
       WHERE company_type = :companyType
       ORDER BY company_name`,
      { companyType: 'supplier' },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch suppliers');
  } finally {
    if (connection) await connection.close();
  }
};

exports.getSupplierById = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT company_id AS "companyId", company_name AS "companyName",
              company_type AS "companyType"
       FROM companies
       WHERE company_id = :id AND company_type = :companyType`,
      { id: req.params.id, companyType: 'supplier' },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch supplier');
  } finally {
    if (connection) await connection.close();
  }
};

exports.createSupplier = async (req, res) => {
  res.status(501).json({ message: 'Supplier mutations are not supported by the current company-based supplier directory' });
};

exports.updateSupplier = async (req, res) => {
  res.status(501).json({ message: 'Supplier mutations are not supported by the current company-based supplier directory' });
};

exports.deleteSupplier = async (req, res) => {
  res.status(501).json({ message: 'Supplier mutations are not supported by the current company-based supplier directory' });
};
