const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const rolePriority = { A: 1, B: 2, C: 3 };
  const userLevel = rolePriority[req.user.role];

  try {
    const result = await pool.query('SELECT * FROM contents');
    console.log(result," Result from database");
    
    const filtered = result.rows.filter(content => {
      return rolePriority[content.access_level] <= userLevel;
    });
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

module.exports = router;