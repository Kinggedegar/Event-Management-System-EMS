import db from '../config/db.js';

const requireOrganizer = (req, res, next) => {
  const user = db
    .prepare('SELECT role FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user || !['organizer', 'admin', 'superadmin'].includes(user.role)) {
    return res.status(403).json({ error: 'Forbidden', message: 'Organizer access required' });
  }

  req.user.role = user.role;
  next();
};

export default requireOrganizer;
