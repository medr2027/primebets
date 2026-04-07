const { db } = require('../database/db');

function parseToken(header = '') {
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token?.startsWith('local-demo-token-')) {
    return null;
  }

  const userId = Number(token.replace('local-demo-token-', ''));
  return Number.isNaN(userId) ? null : userId;
}

function requireAuth(req, res, next) {
  const userId = parseToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = db
    .prepare('SELECT id, username, email, balance, created_at FROM users WHERE id = ?')
    .get(userId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  req.user = user;
  return next();
}

module.exports = {
  requireAuth,
};
