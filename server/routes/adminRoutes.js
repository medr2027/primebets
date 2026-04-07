const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, getAdminStats);

module.exports = router;
