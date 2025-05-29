const pool = require('./db');

async function updateTable() {
  try {
    await pool.query(`
      ALTER TABLE posts ADD COLUMN author_id INTEGER;
    `);
    console.log("✅ Column 'author_id' added to posts table.");
  } catch (err) {
    console.error("❌ Error updating schema:", err.message);
  } finally {
    pool.end();
  }
}

updateTable();
