const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies JWT, attaches req.user
exports.protect = async (req, res, next) => {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Optional auth: attaches req.user if token is present and valid, otherwise continues as guest
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid token for guest flows
  }
  next();
};

// Role-based access control. Usage: authorize('admin', 'superadmin')
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};
