const ApiError = require('../utils/apiError');

// Must run after `protect` middleware (needs req.user)
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required.');
  }
  next();
};

module.exports = adminOnly;
