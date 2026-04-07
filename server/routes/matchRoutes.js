const express = require('express');
const { listMatches, toggleFavorite } = require('../controllers/matchController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, listMatches);
router.patch('/:id/favorite', requireAuth, toggleFavorite);

module.exports = router;
