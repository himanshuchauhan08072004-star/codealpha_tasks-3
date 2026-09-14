const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn, nodeEnv } = require('../config/env');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });

  res.cookie('token', token, {
    httpOnly: true,
    secure: nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateToken;
