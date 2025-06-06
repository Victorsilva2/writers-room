const express = require('express');
const cors = require('cors');
const pool = require('./db'); 
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});


// app.get('/seed-admin', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash('admin123', 10);
//     const result = await pool.query(
//       'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
//       ['Admin', 'admin@writers.com', hashedPassword, 'admin']
//     );
//     res.json({ message: '✅ Admin user created!', user: result.rows[0] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: '❌ Failed to create admin' });
//   }
// });

app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const role = 'user';

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role || 'user']
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    
app.post('/posts', async (req, res) => {
  const { title, content, user_id } = req.body;

  if (!title || !content || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get author name from users table based on user_id
    const userResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const authorName = userResult.rows[0].name;

    // Insert into posts table
    const result = await pool.query(
      `INSERT INTO posts (title, content, author, author_id, user_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, content, authorName, user_id, user_id]
    );

    res.status(201).json({ message: '✅ Post created successfully!', post: result.rows[0] });
  } catch (err) {
    console.error('Post creation error:', err.message);
    res.status(500).json({ error: '❌ Failed to create post' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        posts.id,
        posts.title,
        posts.content,
        posts.created_at,
        users.name AS author_name
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});




    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
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
