const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'primebets.db');
const db = new Database(dbPath);
db.pragma('journal_mode = PERSIST');
db.pragma('foreign_keys = ON');

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      balance REAL DEFAULT 1000,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team1 TEXT NOT NULL,
      team2 TEXT NOT NULL,
      odds1 REAL NOT NULL,
      oddsX REAL NOT NULL,
      odds2 REAL NOT NULL,
      start_time TEXT NOT NULL,
      league TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'upcoming',
      is_live INTEGER NOT NULL DEFAULT 0,
      is_favorite INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      match_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      odd REAL NOT NULL,
      status TEXT NOT NULL,
      selection TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(match_id) REFERENCES matches(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      language TEXT NOT NULL DEFAULT 'en',
      theme TEXT NOT NULL DEFAULT 'dark',
      notifications INTEGER NOT NULL DEFAULT 1,
      compact_mode INTEGER NOT NULL DEFAULT 0,
      odds_format TEXT NOT NULL DEFAULT 'decimal',
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
}

function seedUsers() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (count > 0) return;

  const now = new Date().toISOString();
  const insertUser = db.prepare(
    'INSERT INTO users (username, email, password, balance, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const insertSettings = db.prepare(
    'INSERT INTO settings (user_id, language, theme, notifications, compact_mode, odds_format) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertTx = db.prepare(
    'INSERT INTO transactions (user_id, type, amount, date) VALUES (?, ?, ?, ?)'
  );

  const users = [
    ['Prime Demo', 'demo@primebets.local', 'demo123', 2480.25, now],
    ['Admin Desk', 'admin@primebets.local', 'admin123', 10000, now],
  ];

  users.forEach((user) => {
    const result = insertUser.run(...user);
    const userId = result.lastInsertRowid;
    insertSettings.run(userId, 'en', 'dark', 1, 0, 'decimal');
    insertTx.run(userId, 'deposit', user[3], now);
  });
}

function seedMatches() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM matches').get().count;
  if (count >= 120) return;

  const teams = [
    'Arsenal', 'Barcelona', 'PSG', 'Bayern', 'Juventus', 'Chelsea', 'Inter', 'Milan',
    'Liverpool', 'Ajax', 'Dortmund', 'Napoli', 'Benfica', 'Lyon', 'Monaco', 'Atletico',
    'Roma', 'Leverkusen', 'Marseille', 'Sevilla', 'Manchester City', 'Manchester United',
    'Real Madrid', 'Tottenham', 'Newcastle', 'Porto', 'Sporting', 'Valencia',
    'Fenerbahce', 'Galatasaray', 'Al Ahly', 'Wydad', 'Flamengo', 'River Plate',
    'LA Galaxy', 'Inter Miami', 'Golden State', 'Lakers', 'Celtics', 'Bulls',
    'Nuggets', 'Heat', 'Warriors', 'Novak Team', 'Rafa Team', 'Alcaraz Team',
  ];
  const leagues = [
    'Champions League',
    'Premier League',
    'La Liga',
    'Serie A',
    'Europa League',
    'Conference League',
    'Bundesliga',
    'Ligue 1',
    'NBA',
    'EuroLeague',
    'ATP Masters',
    'WTA Finals',
    'Copa Libertadores',
    'MLS Cup',
    'Africa Cup',
  ];
  const categories = ['Football', 'Basketball', 'Tennis'];
  const insertMatch = db.prepare(
    `INSERT INTO matches
      (team1, team2, odds1, oddsX, odds2, start_time, league, category, status, is_live, is_favorite)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (let index = count; index < 140; index += 1) {
    let team1 = randomChoice(teams);
    let team2 = randomChoice(teams);
    while (team1 === team2) {
      team2 = randomChoice(teams);
    }

    const startsAt = new Date(Date.now() + (index - 4) * 3600 * 1000);
    const isLive = index < 6 ? 1 : 0;
    insertMatch.run(
      team1,
      team2,
      (1.4 + Math.random() * 2.2).toFixed(2),
      (2.7 + Math.random() * 1.4).toFixed(2),
      (1.8 + Math.random() * 2.6).toFixed(2),
      startsAt.toISOString(),
      randomChoice(leagues),
      randomChoice(categories),
      isLive ? 'live' : 'upcoming',
      isLive,
      index % 7 === 0 ? 1 : 0
    );
  }
}

function seedBets() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM bets').get().count;
  if (count > 0) return;

  const demoUser = db.prepare("SELECT id FROM users WHERE email = 'demo@primebets.local'").get();
  const matches = db.prepare('SELECT id, odds1, oddsX, odds2 FROM matches LIMIT 8').all();
  const insertBet = db.prepare(
    'INSERT INTO bets (user_id, match_id, amount, odd, status, selection, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const statuses = ['won', 'lost', 'pending', 'cashed_out'];
  const selections = ['1', 'X', '2'];

  matches.forEach((match, index) => {
    const selection = selections[index % selections.length];
    const odd = selection === '1' ? match.odds1 : selection === 'X' ? match.oddsX : match.odds2;
    insertBet.run(
      demoUser.id,
      match.id,
      20 + index * 5,
      odd,
      statuses[index % statuses.length],
      selection,
      new Date(Date.now() - index * 86400000).toISOString()
    );
  });
}

function initializeDatabase() {
  createSchema();
  seedUsers();
  seedMatches();
  seedBets();
}

module.exports = {
  db,
  initializeDatabase,
};
