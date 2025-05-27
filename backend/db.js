const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'writers_db',
  password: 'Crazysquid9',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;
