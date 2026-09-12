const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  wishlist: user.wishlist,
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is disabled' });

    const token = signToken(user._id);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

// Super-admin creates a new admin account
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const admin = await User.create({ name, email, password, role: 'admin' });
    res.status(201).json({ user: sanitize(admin) });
  } catch (err) {
    next(err);
  }
};
