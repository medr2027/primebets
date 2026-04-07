const { updateSettings, getSettingsByUserId } = require('../models/settingsModel');

function getSettings(req, res) {
  return res.json({ settings: getSettingsByUserId(req.user.id) });
}

function saveSettings(req, res) {
  const payload = {
    language: req.body.language || 'en',
    theme: req.body.theme || 'dark',
    notifications: Boolean(req.body.notifications),
    compact_mode: Boolean(req.body.compact_mode),
    odds_format: req.body.odds_format || 'decimal',
  };

  const settings = updateSettings(req.user.id, payload);
  return res.json({ settings });
}

module.exports = {
  getSettings,
  saveSettings,
};
