const { db } = require('../database/db');

function getWalletOverview(req, res) {
  const user = db.prepare('SELECT id, balance FROM users WHERE id = ?').get(req.user.id);
  const transactions = db
    .prepare('SELECT id, type, amount, date FROM transactions WHERE user_id = ? ORDER BY datetime(date) DESC LIMIT 10')
    .all(req.user.id);

  return res.json({
    balance: user.balance,
    transactions,
    paymentMethods: [
      'Bank Transfer',
      'Visa / Mastercard',
      'PayPal',
      'Skrill',
      'Neteller',
      'Apple Pay',
      'Google Pay',
      'USDT Wallet',
    ],
  });
}

function deposit(req, res) {
  const amount = Number(req.body?.amount);
  const method = String(req.body?.method || '').trim();

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Deposit amount must be greater than 0.' });
  }

  if (!method) {
    return res.status(400).json({ message: 'Payment method is required.' });
  }

  db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(amount, req.user.id);
  db.prepare('INSERT INTO transactions (user_id, type, amount, date) VALUES (?, ?, ?, ?)').run(
    req.user.id,
    `deposit:${method}`,
    Math.abs(amount),
    new Date().toISOString()
  );

  const user = db.prepare('SELECT id, username, email, balance, created_at FROM users WHERE id = ?').get(req.user.id);
  return res.status(201).json({ message: 'Deposit completed.', user });
}

module.exports = {
  getWalletOverview,
  deposit,
};
