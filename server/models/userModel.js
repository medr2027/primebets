const { db } = require('../database/db');

function createUser({ username, email, password }) {
  const now = new Date().toISOString();
  const result = db
    .prepare('INSERT INTO users (username, email, password, balance, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(username, email, password, 1000, now);

  db.prepare(
    'INSERT INTO settings (user_id, language, theme, notifications, compact_mode, odds_format) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(result.lastInsertRowid, 'en', 'dark', 1, 0, 'decimal');

  return findUserById(result.lastInsertRowid);
}

function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function findUserById(id) {
  return db
    .prepare('SELECT id, username, email, balance, created_at FROM users WHERE id = ?')
    .get(id);
}

function updateUser(id, payload) {
  db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?').run(payload.username, payload.email, id);
  return findUserById(id);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};
