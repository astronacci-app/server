const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const userRole = req.user.role;

  try {
    const result = await pool.query('SELECT * FROM contents ORDER BY id ASC');
    const allContents = result.rows;

    const articles = allContents.filter(item => item.type === 'article');
    const videos = allContents.filter(item => item.type === 'video');

    let filtered = [];

    if (userRole === 'A') {
      filtered = [
        ...articles.slice(0, 3),
        ...videos.slice(0, 3)
      ];
    } else if (userRole === 'B') {
      filtered = [
        ...articles.slice(0, 10),
        ...videos.slice(0, 10)
      ].slice(0, 20);
    } else if (userRole === 'C') {
      filtered = allContents;
    }

    res.json({ filtered, total: filtered.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

module.exports = router;