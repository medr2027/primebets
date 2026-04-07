const { db } = require('../database/db');

function getAdminStats(_req, res) {
  const users = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const bets = db.prepare('SELECT COUNT(*) AS count FROM bets').get().count;
  const matches = db.prepare('SELECT COUNT(*) AS count FROM matches').get().count;
  const activity = db
    .prepare(
      `SELECT
         bets.id,
         users.username,
         matches.team1,
         matches.team2,
         bets.amount,
         bets.status,
         bets.created_at
       FROM bets
       JOIN users ON users.id = bets.user_id
       JOIN matches ON matches.id = bets.match_id
       ORDER BY datetime(bets.created_at) DESC
       LIMIT 8`
    )
    .all();

  return res.json({
    stats: { users, bets, matches },
    activity,
  });
}

module.exports = {
  getAdminStats,
};
