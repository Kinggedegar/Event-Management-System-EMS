// src/middleware/requireAdmin.js
import db from '../config/db.js';

const requireAdmin = (req, res, next) => {
  const user = db
    .prepare('SELECT role FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin or superadmin access required'
    });
  }

  req.user.role = user.role;
  next();
};

export default requireAdmin;
