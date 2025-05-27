const express = require('express');
const cors = require('cors');
const pool = require('./db'); // <== Add this line

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});


app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Connected to DB!', time: result.rows[0].now });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
