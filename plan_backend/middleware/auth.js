const User = require('../models/User');

exports.auth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth failed' });
  }
};

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
