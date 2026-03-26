// src/middleware/optionalAuth.js
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in .env');
}

const optionalAuth = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db
      .prepare('SELECT id, email, role, status FROM users WHERE id = ?')
      .get(decoded.userId);

    if (!user) {
      return next();
    }

    if (user.status === 'suspended' || user.status === 'deleted') {
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    };
  } catch (err) {
    // Ignore invalid/expired tokens for public access
  }

  return next();
};

export default optionalAuth;
