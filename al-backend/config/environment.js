const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const requiredVariables = ['ORACLE_DB_USER', 'ORACLE_DB_PASSWORD', 'ORACLE_CONNECT_STRING', 'JWT_SECRET'];
const missingVariables = requiredVariables.filter(variable => !process.env[variable]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}. Configure al-backend/.env before starting the server.`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long.');
}

const dbConfig = {
  user: process.env.ORACLE_DB_USER,
  password: process.env.ORACLE_DB_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING
};

module.exports = { dbConfig };
