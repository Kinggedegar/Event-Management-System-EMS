// src/controllers/categoryController.js
import db from '../config/db.js';
import auditService from '../services/auditService.js';

const categoryController = {
  list(req, res, next) {
    try {
      const categories = db
        .prepare(
          `
            SELECT c.*, COUNT(e.id) as event_count
            FROM categories c
            LEFT JOIN events e ON e.category_id = c.id AND e.deleted_at IS NULL
            GROUP BY c.id
            ORDER BY c.name ASC
          `
        )
        .all();

      res.json({ categories });
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      const { name, description = null, icon = null, color = '#3b82f6' } = req.body;
      if (!name || typeof name !== 'string') {
        const err = new Error('Name is required');
        err.statusCode = 400;
        return next(err);
      }

      const result = db
        .prepare('INSERT INTO categories (name, description, icon, color) VALUES (?, ?, ?, ?)')
        .run(name.trim(), description, icon, color);

      auditService.log({
        actorUserId: req.user?.id || null,
        action: 'category.create',
        targetType: 'category',
        targetId: result.lastInsertRowid,
        ipAddress: req.ip,
        details: { name: name.trim() }
      });

      const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json({ category });
    } catch (err) {
      if (err.message?.includes('UNIQUE')) {
        err.statusCode = 409;
      }
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const { name, description = null, icon = null, color = '#3b82f6' } = req.body;

      const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId);
      if (!existing) {
        const err = new Error('Category not found');
        err.statusCode = 404;
        return next(err);
      }

      db.prepare(
        'UPDATE categories SET name = ?, description = ?, icon = ?, color = ? WHERE id = ?'
      ).run(name.trim(), description, icon, color, categoryId);

      auditService.log({
        actorUserId: req.user?.id || null,
        action: 'category.update',
        targetType: 'category',
        targetId: categoryId,
        ipAddress: req.ip,
        details: { name: name.trim() }
      });

      const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
      res.json({ category });
    } catch (err) {
      if (err.message?.includes('UNIQUE')) {
        err.statusCode = 409;
      }
      next(err);
    }
  },

  remove(req, res, next) {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId);
      if (!existing) {
        const err = new Error('Category not found');
        err.statusCode = 404;
        return next(err);
      }

      // Detach from events to avoid orphan references
      db.prepare('UPDATE events SET category_id = NULL WHERE category_id = ?').run(categoryId);
      db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);

      auditService.log({
        actorUserId: req.user?.id || null,
        action: 'category.delete',
        targetType: 'category',
        targetId: categoryId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};

export default categoryController;
