const express = require('express');
const { listBets, placeBet } = require('../controllers/betController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, listBets);
router.post('/', requireAuth, placeBet);

module.exports = router;
