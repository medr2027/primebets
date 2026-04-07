const { db } = require('../database/db');

function listMatches(req, res) {
  const { q = '', category = 'all', status = 'all' } = req.query;

  let query = 'SELECT * FROM matches WHERE 1 = 1';
  const params = [];

  if (q) {
    query += ' AND (team1 LIKE ? OR team2 LIKE ? OR league LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }

  if (category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY datetime(start_time) ASC';
  const matches = db.prepare(query).all(...params);
  return res.json({ matches });
}

function toggleFavorite(req, res) {
  const { id } = req.params;
  const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
  if (!match) {
    return res.status(404).json({ message: 'Match not found.' });
  }

  db.prepare('UPDATE matches SET is_favorite = ? WHERE id = ?').run(match.is_favorite ? 0 : 1, id);
  const updated = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
  return res.json({ match: updated });
}

module.exports = {
  listMatches,
  toggleFavorite,
};
