const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET_KEY || 'your-secret-key-change-this-in-production';
const ACCESS_TOKEN_EXPIRE_DAYS = 30;

function createAccessToken(userId, email) {
  const expiresIn = ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60;
  return jwt.sign({ sub: userId.toString(), email }, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { createAccessToken, verifyToken };

