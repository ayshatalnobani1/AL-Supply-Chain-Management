const oracledb = require('oracledb');

const { dbConfig } = require('../config/environment');

async function initialize() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('✅ Oracle DB pool started');
  } catch (err) {
    console.error('Error initializing DB pool:', err);
    throw err;
  }
}

async function close() {
  try {
    await oracledb.getPool().close();
    console.log('🛑 Oracle DB pool closed');
  } catch (err) {
    console.error('Error closing DB pool:', err);
  }
}

module.exports = {
  initialize,
  close,
  getConnection: () => oracledb.getConnection()
};
