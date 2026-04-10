const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { getWalletOverview, deposit } = require('../controllers/walletController');

const router = express.Router();

router.get('/', requireAuth, getWalletOverview);
router.post('/deposit', requireAuth, deposit);

module.exports = router;
