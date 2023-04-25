const { Pool } = require('pg');
require("dotenv").config();

// create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connectToDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.stack);
  }
}

module.exports = {
  pool,
  connectToDatabase,
};