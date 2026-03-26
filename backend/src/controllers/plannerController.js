import db from '../config/db.js';

const plannerController = {
  listRecommended(req, res, next) {
    try {
      const rows = db.prepare(`
        SELECT u.id, u.name, u.phone, u.profession, u.profile_image_url, COUNT(e.id) as event_count
        FROM users u
        LEFT JOIN events e ON e.organizer_id = u.id AND e.deleted_at IS NULL
        WHERE u.role = 'organizer' AND u.status = 'active'
        GROUP BY u.id
        ORDER BY event_count DESC
        LIMIT 8
      `).all();

      res.json({ planners: rows });
    } catch (err) {
      next(err);
    }
  },

  getProfile(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = db.prepare('SELECT id, name, phone, profession, profile_image_url FROM users WHERE id = ? AND role = "organizer"').get(id);
      if (!user) return res.status(404).json({ error: 'Planner not found' });

      const events = db.prepare('SELECT id, name as title, date, location, price_cents FROM events WHERE organizer_id = ? AND status = "active" AND deleted_at IS NULL ORDER BY date DESC LIMIT 6').all(id);
      const mapped = events.map(e => ({ id: e.id, title: e.title, date: e.date, location: e.location, price: (e.price_cents || 0)/100 }));

      res.json({ profile: { ...user, recent_events: mapped } });
    } catch (err) {
      next(err);
    }
  }
};

export default plannerController;
