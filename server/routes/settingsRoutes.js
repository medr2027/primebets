const express = require('express');
const { getSettings, saveSettings } = require('../controllers/settingsController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, getSettings);
router.put('/', requireAuth, saveSettings);

module.exports = router;
