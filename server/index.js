const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const matchRoutes = require('./routes/matchRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const betRoutes = require('./routes/betRoutes');
const walletRoutes = require('./routes/walletRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminRoutes = require('./routes/adminRoutes');

initializeDatabase();

const app = express();
const PORT = 4000;
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`PrimeBets server listening on http://localhost:${PORT}`);
});
