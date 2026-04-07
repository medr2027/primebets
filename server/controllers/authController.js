const { createUser, findUserByEmail, updateUser } = require('../models/userModel');
const { getSettingsByUserId } = require('../models/settingsModel');

function makeAuthPayload(user) {
  return {
    token: `local-demo-token-${user.id}`,
    user,
    settings: getSettingsByUserId(user.id),
  };
}

function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const user = createUser({ username, email, password });
  return res.status(201).json(makeAuthPayload(user));
}

function login(req, res) {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json(
    makeAuthPayload({
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      created_at: user.created_at,
    })
  );
}

function me(req, res) {
  return res.json({
    user: req.user,
    settings: getSettingsByUserId(req.user.id),
  });
}

function updateProfile(req, res) {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required.' });
  }

  const existing = findUserByEmail(email);
  if (existing && existing.id !== req.user.id) {
    return res.status(409).json({ message: 'Email already in use.' });
  }

  const user = updateUser(req.user.id, { username, email });
  return res.json({ user });
}

module.exports = {
  register,
  login,
  me,
  updateProfile,
};
