const pool = require('./db');

const setupDB = async () => {
  try {
    // Create USERS table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      );
    `);

    // Create POSTS table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add missing columns if they don't exist (ALTER TABLE is safe to run multiple times)
    await pool.query(`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_id INTEGER;
    `);

    await pool.query(`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
    `);

    console.log("✅ Tables created/updated successfully on Render PostgreSQL.");
    process.exit();
  } catch (err) {
    console.error("❌ Error setting up tables:", err.message);
    process.exit(1);
  }
};

setupDB();
