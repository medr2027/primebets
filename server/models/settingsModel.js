const { db } = require('../database/db');

function getSettingsByUserId(userId) {
  return db
    .prepare('SELECT language, theme, notifications, compact_mode, odds_format FROM settings WHERE user_id = ?')
    .get(userId);
}

function updateSettings(userId, payload) {
  db.prepare(
    `UPDATE settings
     SET language = ?, theme = ?, notifications = ?, compact_mode = ?, odds_format = ?
     WHERE user_id = ?`
  ).run(
    payload.language,
    payload.theme,
    payload.notifications ? 1 : 0,
    payload.compact_mode ? 1 : 0,
    payload.odds_format,
    userId
  );

  return getSettingsByUserId(userId);
}

module.exports = {
  getSettingsByUserId,
  updateSettings,
};
