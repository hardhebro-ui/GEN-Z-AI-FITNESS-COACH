import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite Database
const db = new Database('reviews.db');

// Create reviews table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL,
    text TEXT,
    name TEXT,
    date TEXT NOT NULL
  )
`);

// API Routes
app.get('/api/reviews', (req, res) => {
  try {
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY id DESC LIMIT 11').all();
    
    const stats = db.prepare('SELECT COUNT(*) as count, AVG(rating) as avg FROM reviews').get() as { count: number, avg: number | null };
    
    res.json({
      reviews,
      totalCount: stats.count,
      averageRating: stats.avg ? Number(stats.avg.toFixed(1)) : 0
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const { rating, text, name } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    const stmt = db.prepare('INSERT INTO reviews (rating, text, name, date) VALUES (?, ?, ?, ?)');
    const result = stmt.run(
      rating,
      text ? text.substring(0, 200) : null,
      name || 'Anonymous',
      new Date().toISOString()
    );

    res.status(201).json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
