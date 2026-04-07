const { db } = require('../database/db');
const { getSettingsByUserId } = require('../models/settingsModel');

function getDashboard(req, res) {
  const summary = db
    .prepare(
      `SELECT
         COUNT(*) AS totalBets,
         SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS wins,
         SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) AS losses,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS activeBets
       FROM bets
       WHERE user_id = ?`
    )
    .get(req.user.id);

  const liveMatches = db.prepare('SELECT * FROM matches WHERE is_live = 1 ORDER BY datetime(start_time) ASC LIMIT 6').all();
  const upcomingMatches = db.prepare("SELECT * FROM matches WHERE status = 'upcoming' ORDER BY datetime(start_time) ASC LIMIT 8").all();
  const favorites = db.prepare('SELECT * FROM matches WHERE is_favorite = 1 ORDER BY datetime(start_time) ASC LIMIT 5').all();
  const activity = db
    .prepare(
      `SELECT bets.id, bets.amount, bets.status, bets.selection, bets.created_at, matches.team1, matches.team2
       FROM bets
       JOIN matches ON matches.id = bets.match_id
       WHERE bets.user_id = ?
       ORDER BY datetime(bets.created_at) DESC
       LIMIT 6`
    )
    .all(req.user.id);

  return res.json({
    summary: {
      balance: req.user.balance,
      activeBets: summary.activeBets || 0,
      wins: summary.wins || 0,
      losses: summary.losses || 0,
      totalBets: summary.totalBets || 0,
    },
    liveMatches,
    upcomingMatches,
    favorites,
    activity,
    settings: getSettingsByUserId(req.user.id),
  });
}

module.exports = {
  getDashboard,
};
