const { db } = require('../database/db');

function listBets(req, res) {
  const bets = db
    .prepare(
      `SELECT
         bets.id,
         bets.amount,
         bets.odd,
         bets.status,
         bets.selection,
         bets.created_at,
         matches.team1,
         matches.team2,
         matches.league
       FROM bets
       JOIN matches ON matches.id = bets.match_id
       WHERE bets.user_id = ?
       ORDER BY datetime(bets.created_at) DESC`
    )
    .all(req.user.id);

  const transactions = db
    .prepare('SELECT id, type, amount, date FROM transactions WHERE user_id = ? ORDER BY datetime(date) DESC')
    .all(req.user.id);

  return res.json({ bets, transactions });
}

function placeBet(req, res) {
  const { matchId, amount, odd, selection } = req.body;
  if (!matchId || !amount || !odd || !selection) {
    return res.status(400).json({ message: 'Missing bet details.' });
  }

  const result = db
    .prepare(
      'INSERT INTO bets (user_id, match_id, amount, odd, status, selection, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(req.user.id, matchId, amount, odd, 'pending', selection, new Date().toISOString());

  db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(amount, req.user.id);
  db.prepare('INSERT INTO transactions (user_id, type, amount, date) VALUES (?, ?, ?, ?)').run(
    req.user.id,
    'bet',
    -Math.abs(amount),
    new Date().toISOString()
  );

  const bet = db.prepare('SELECT * FROM bets WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ bet });
}

module.exports = {
  listBets,
  placeBet,
};
