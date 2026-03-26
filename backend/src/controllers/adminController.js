// src/controllers/adminController.js
import db from '../config/db.js';
import eventService from '../services/eventService.js';
import bookingService from '../services/bookingService.js';
import attendanceService from '../services/attendanceService.js';
import auditService from '../services/auditService.js';

const normalizeRoleInput = (role) => {
  if (!role) return null;
  const r = role.trim().toLowerCase();
  if (['attendee', 'organizer', 'admin', 'superadmin'].includes(r)) return r;
  return null;
};

const roleForResponse = (role) => {
  if (!role) return 'attendee';
  // keep superadmin as 'superadmin' in raw role but surface 'admin' to UI when appropriate
  if (role === 'superadmin') return 'admin';
  return role;
};

const mapEventStatusToUi = (status) => {
  if (status === 'active') return 'published';
  return status || 'draft';
};

const mapEventStatusToDb = (status) => {
  if (status === 'published') return 'active';
  return status;
};

const adminController = {
  async createEvent(req, res, next) {
    try {
      const result = eventService.createEvent({
        name: req.body.name,
        description: req.body.description || null,
        totalCapacity: req.body.totalCapacity,
        priceCents: req.body.priceCents,
        location: req.body.location || null,
        date: req.body.date,
        categoryId: req.body.categoryId || null,
        imageUrl: req.body.imageUrl || null,
        organizerId: req.user.id
      });

      auditService.log({
        actorUserId: req.user.id,
        action: 'event.create',
        targetType: 'event',
        targetId: result.eventId,
        ipAddress: req.ip,
        details: { name: req.body.name }
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async bookVendorSpace(req, res, next) {
    try {
      const { eventId } = req.body;
      const result = bookingService.bookSpace(req.user.id, eventId, 'vendor_booth');
      auditService.log({
        actorUserId: req.user.id,
        action: 'booking.vendor.create',
        targetType: 'event',
        targetId: eventId,
        ipAddress: req.ip
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async scanAttendance(req, res, next) {
    try {
      const { ticketId, bookingId, userId, eventId } = req.body;
      const result = attendanceService.recordAttendance(ticketId, bookingId, userId, eventId);
      auditService.log({
        actorUserId: req.user.id,
        action: 'attendance.scan',
        targetType: 'event',
        targetId: eventId,
        ipAddress: req.ip,
        details: { ticketId, bookingId, userId }
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getStats(req, res, next) {
    try {
      const totalUsers = db
        .prepare("SELECT COUNT(*) as count FROM users WHERE status != 'deleted' OR status IS NULL")
        .get().count;
      const totalEvents = db
        .prepare('SELECT COUNT(*) as count FROM events WHERE deleted_at IS NULL')
        .get().count;
      const totalRegistrations = db
        .prepare('SELECT COUNT(*) as count FROM tickets')
        .get().count;
      const totalRevenueCents = db
        .prepare(`
          SELECT COALESCE(SUM(t.amount_cents), 0) as total
          FROM transactions t
          LEFT JOIN refunds r ON r.transaction_id = t.id
          WHERE t.status = 'completed' AND r.id IS NULL
        `)
        .get().total;

      const attendees = db
        .prepare("SELECT COUNT(*) as count FROM users WHERE role = 'attendee' AND (status != 'deleted' OR status IS NULL)")
        .get().count;
      const admins = db
        .prepare("SELECT COUNT(*) as count FROM users WHERE role IN ('admin','superadmin') AND (status != 'deleted' OR status IS NULL)")
        .get().count;
      const organizers = db
        .prepare('SELECT COUNT(DISTINCT organizer_id) as count FROM events WHERE organizer_id IS NOT NULL AND deleted_at IS NULL')
        .get().count;

      const recentUsers = db
        .prepare(`
          SELECT id, name, email, role, created_at
          FROM users
          WHERE status != 'deleted' OR status IS NULL
          ORDER BY created_at DESC
          LIMIT 5
        `)
        .all()
        .map((u) => ({
          ...u,
          role: roleForResponse(u.role),
          name: u.name || u.email?.split('@')[0] || 'User'
        }));

      const recentEvents = db
        .prepare(`
          SELECT id, name, status, image_url, created_at
          FROM events
          WHERE deleted_at IS NULL
          ORDER BY created_at DESC
          LIMIT 5
        `)
        .all()
        .map((e) => ({
          id: e.id,
          title: e.name,
          status: mapEventStatusToUi(e.status),
          image_url: e.image_url || null
        }));

      res.json({
        stats: {
          totalUsers,
          totalEvents,
          totalRegistrations,
          totalRevenue: totalRevenueCents / 100,
          attendees,
          organizers,
          admins
        },
        recentUsers,
        recentEvents
      });
    } catch (err) {
      next(err);
    }
  },

  async listUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const offset = (page - 1) * limit;
      const search = (req.query.search || '').trim();
      const role = normalizeRoleInput(req.query.role || '');
      const status = (req.query.status || '').trim();

      const conditions = [];
      const params = [];

      if (search) {
        conditions.push('(email LIKE ? OR name LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      if (role) {
        if (role === 'admin') {
          conditions.push("role IN ('admin','superadmin')");
        } else {
          conditions.push('role = ?');
          params.push(role);
        }
      }

      if (status) {
        conditions.push('status = ?');
        params.push(status);
      } else {
        conditions.push("status != 'deleted' OR status IS NULL");
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const total = db.prepare(`SELECT COUNT(*) as count FROM users ${whereClause}`).get(...params).count;
      const users = db
        .prepare(
          `
            SELECT id, name, email, role, status, created_at
            FROM users
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
          `
        )
        .all(...params, limit, offset);

      const formatted = users.map((u) => ({
        id: u.id,
        name: u.name || u.email?.split('@')[0] || 'User',
        email: u.email,
        role: roleForResponse(u.role),
        role_raw: u.role,
        status: u.status || 'active',
        created_at: u.created_at
      }));

      res.json({
        users: formatted,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUserRole(req, res, next) {
    try {
      const userId = parseInt(req.params.id, 10);
      const normalizedRole = normalizeRoleInput(req.body.role);

      if (!normalizedRole) {
        const err = new Error('Invalid role');
        err.statusCode = 400;
        return next(err);
      }

      const target = db.prepare('SELECT id, role, status FROM users WHERE id = ?').get(userId);
      if (!target) {
        const err = new Error('User not found');
        err.statusCode = 404;
        return next(err);
      }

      if (req.user.id === userId && normalizedRole !== target.role) {
        const err = new Error('You cannot change your own role');
        err.statusCode = 403;
        return next(err);
      }

      if (['admin', 'superadmin'].includes(target.role) && req.user.role !== 'superadmin') {
        const err = new Error('Only superadmin can modify admin roles');
        err.statusCode = 403;
        return next(err);
      }

      if (target.role === 'superadmin' && normalizedRole !== 'superadmin') {
        const err = new Error('Superadmin role cannot be downgraded');
        err.statusCode = 403;
        return next(err);
      }

      if (normalizedRole === 'superadmin' && req.user.role !== 'superadmin') {
        const err = new Error('Only superadmin can assign superadmin role');
        err.statusCode = 403;
        return next(err);
      }

      db.prepare('UPDATE users SET role = ? WHERE id = ?').run(normalizedRole, userId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'user.role.update',
        targetType: 'user',
        targetId: userId,
        ipAddress: req.ip,
        details: { role: normalizedRole }
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async updateUserStatus(req, res, next) {
    try {
      const userId = parseInt(req.params.id, 10);
      const status = (req.body.status || '').trim();

      if (!['active', 'suspended'].includes(status)) {
        const err = new Error('Invalid status');
        err.statusCode = 400;
        return next(err);
      }

      const target = db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId);
      if (!target) {
        const err = new Error('User not found');
        err.statusCode = 404;
        return next(err);
      }

      if (req.user.id === userId) {
        const err = new Error('You cannot change your own status');
        err.statusCode = 403;
        return next(err);
      }

      if (['admin', 'superadmin'].includes(target.role) && req.user.role !== 'superadmin') {
        const err = new Error('Only superadmin can change admin status');
        err.statusCode = 403;
        return next(err);
      }

      if (target.role === 'superadmin') {
        const err = new Error('Superadmin status cannot be changed');
        err.statusCode = 403;
        return next(err);
      }

      db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, userId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'user.status.update',
        targetType: 'user',
        targetId: userId,
        ipAddress: req.ip,
        details: { status }
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id, 10);
      const target = db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId);

      if (!target) {
        const err = new Error('User not found');
        err.statusCode = 404;
        return next(err);
      }

      if (req.user.id === userId) {
        const err = new Error('You cannot delete your own account');
        err.statusCode = 403;
        return next(err);
      }

      if (['admin', 'superadmin'].includes(target.role) && req.user.role !== 'superadmin') {
        const err = new Error('Only superadmin can delete admins');
        err.statusCode = 403;
        return next(err);
      }

      if (target.role === 'superadmin') {
        const err = new Error('Superadmin account cannot be deleted');
        err.statusCode = 403;
        return next(err);
      }

      db.prepare("UPDATE users SET status = 'deleted', deleted_at = datetime('now') WHERE id = ?").run(userId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'user.delete',
        targetType: 'user',
        targetId: userId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async listEvents(req, res, next) {
    try {
      const events = db
        .prepare(
          `
            SELECT e.*, u.name as organizer_name, u.email as organizer_email
            FROM events e
            LEFT JOIN users u ON u.id = e.organizer_id
            WHERE e.deleted_at IS NULL
            ORDER BY e.created_at DESC
          `
        )
        .all();

      const formatted = events.map((event) => {
        const registrationCount = db
          .prepare('SELECT COUNT(*) as count FROM tickets WHERE event_id = ?')
          .get(event.id).count;
        const revenueCents = db
          .prepare(
            `
              SELECT COALESCE(SUM(t.amount_cents), 0) as total
              FROM transactions t
              JOIN tickets tk ON tk.id = t.ticket_id
              LEFT JOIN refunds r ON r.transaction_id = t.id
              WHERE tk.event_id = ? AND t.status = 'completed' AND r.id IS NULL
            `
          )
          .get(event.id).total;

        return {
          id: event.id,
          title: event.name,
          organizer_name: event.organizer_name || 'System',
          organizer_email: event.organizer_email || 'system@local',
          event_date: event.date,
          location: event.location,
          status: mapEventStatusToUi(event.status),
          featured: !!event.featured,
          category_id: event.category_id,
          image_url: event.image_url,
          registration_count: registrationCount,
          revenue: revenueCents / 100
        };
      });

      res.json({ events: formatted });
    } catch (err) {
      next(err);
    }
  },

  async updateEventStatus(req, res, next) {
    try {
      const eventId = parseInt(req.params.id, 10);
      const status = mapEventStatusToDb(req.body.status);

      if (!['draft', 'active', 'cancelled'].includes(status)) {
        const err = new Error('Invalid status');
        err.statusCode = 400;
        return next(err);
      }

      db.prepare("UPDATE events SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, eventId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'event.status.update',
        targetType: 'event',
        targetId: eventId,
        ipAddress: req.ip,
        details: { status }
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async featureEvent(req, res, next) {
    try {
      const eventId = parseInt(req.params.id, 10);
      const featured = !!req.body.featured;

      db.prepare("UPDATE events SET featured = ?, updated_at = datetime('now') WHERE id = ?").run(
        featured ? 1 : 0,
        eventId
      );

      auditService.log({
        actorUserId: req.user.id,
        action: featured ? 'event.feature' : 'event.unfeature',
        targetType: 'event',
        targetId: eventId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async deleteEvent(req, res, next) {
    try {
      const eventId = parseInt(req.params.id, 10);
      db.prepare("UPDATE events SET deleted_at = datetime('now'), status = 'cancelled' WHERE id = ?").run(eventId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'event.delete',
        targetType: 'event',
        targetId: eventId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async listPayments(req, res, next) {
    try {
      const statusFilter = (req.query.status || '').trim();
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);

      const rows = db
        .prepare(
          `
            SELECT t.*, r.id as refund_id, u.name as user_name, u.email as user_email, e.name as event_title
            FROM transactions t
            LEFT JOIN refunds r ON r.transaction_id = t.id
            LEFT JOIN tickets tk ON tk.id = t.ticket_id
            LEFT JOIN events e ON e.id = tk.event_id
            LEFT JOIN users u ON u.id = t.user_id
            ORDER BY t.created_at DESC
          `
        )
        .all();

      const mapped = rows.map((row) => {
        const status = row.refund_id ? 'refunded' : row.status || 'pending';
        return {
          id: row.id,
          transaction_id: `TXN-${row.id}`,
          user_name: row.user_name || row.user_email || 'User',
          user_email: row.user_email || '',
          event_title: row.event_title || 'Event',
          amount: (row.amount_cents || 0) / 100,
          currency: row.currency || 'USD',
          method: row.method || 'card',
          status,
          created_at: row.created_at,
          updated_at: row.updated_at || row.created_at,
          payment_details: row.payment_details || null
        };
      });

      const filtered = statusFilter ? mapped.filter((p) => p.status === statusFilter) : mapped;
      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + limit);

      res.json({
        payments: paginated,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async refundPayment(req, res, next) {
    try {
      const transactionId = parseInt(req.params.id, 10);
      const transaction = db.prepare('SELECT id, status FROM transactions WHERE id = ?').get(transactionId);

      if (!transaction) {
        const err = new Error('Transaction not found');
        err.statusCode = 404;
        return next(err);
      }

      if (transaction.status !== 'completed') {
        const err = new Error('Only completed transactions can be refunded');
        err.statusCode = 400;
        return next(err);
      }

      const existingRefund = db.prepare('SELECT id FROM refunds WHERE transaction_id = ?').get(transactionId);
      if (existingRefund) {
        const err = new Error('Refund already processed for this transaction');
        err.statusCode = 409;
        return next(err);
      }

      db.prepare('INSERT INTO refunds (transaction_id, created_by, reason) VALUES (?, ?, ?)').run(
        transactionId,
        req.user.id,
        req.body?.reason || null
      );

      db.prepare("UPDATE transactions SET updated_at = datetime('now') WHERE id = ?").run(transactionId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'payment.refund',
        targetType: 'transaction',
        targetId: transactionId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async listReviews(req, res, next) {
    try {
      const statusFilter = (req.query.status || '').trim();
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);

      const rows = db
        .prepare(
          `
            SELECT r.*, u.name as user_name, u.email as user_email, e.name as event_title
            FROM reviews r
            LEFT JOIN users u ON u.id = r.user_id
            LEFT JOIN events e ON e.id = r.event_id
            WHERE r.deleted_at IS NULL
            ORDER BY r.created_at DESC
          `
        )
        .all();

      const mapped = rows.map((row) => ({
        id: row.id,
        rating: row.rating,
        comment: row.comment,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,
        user_name: row.user_name || row.user_email || 'User',
        user_email: row.user_email || '',
        event_title: row.event_title || 'Event'
      }));

      const filtered = statusFilter ? mapped.filter((r) => r.status === statusFilter) : mapped;
      const total = filtered.length;
      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + limit);

      res.json({
        reviews: paginated,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async approveReview(req, res, next) {
    try {
      const reviewId = parseInt(req.params.id, 10);
      db.prepare("UPDATE reviews SET status = 'approved', updated_at = datetime('now') WHERE id = ?").run(reviewId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'review.approve',
        targetType: 'review',
        targetId: reviewId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async rejectReview(req, res, next) {
    try {
      const reviewId = parseInt(req.params.id, 10);
      db.prepare("UPDATE reviews SET status = 'rejected', updated_at = datetime('now') WHERE id = ?").run(reviewId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'review.reject',
        targetType: 'review',
        targetId: reviewId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async deleteReview(req, res, next) {
    try {
      const reviewId = parseInt(req.params.id, 10);
      db.prepare("UPDATE reviews SET deleted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?").run(reviewId);

      auditService.log({
        actorUserId: req.user.id,
        action: 'review.delete',
        targetType: 'review',
        targetId: reviewId,
        ipAddress: req.ip
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async getReports(req, res, next) {
    try {
      const totalRevenueCents = db
        .prepare(
          `
            SELECT COALESCE(SUM(t.amount_cents), 0) as total
            FROM transactions t
            LEFT JOIN refunds r ON r.transaction_id = t.id
            WHERE t.status = 'completed' AND r.id IS NULL
          `
        )
        .get().total;

      const activeUsers = db
        .prepare("SELECT COUNT(*) as count FROM users WHERE status != 'deleted' OR status IS NULL")
        .get().count;
      const newUsersThisMonth = db
        .prepare("SELECT COUNT(*) as count FROM users WHERE created_at >= date('now','start of month')")
        .get().count;
      const eventsThisMonth = db
        .prepare("SELECT COUNT(*) as count FROM events WHERE created_at >= date('now','start of month') AND deleted_at IS NULL")
        .get().count;
      const upcomingEvents = db
        .prepare("SELECT COUNT(*) as count FROM events WHERE date >= date('now') AND deleted_at IS NULL")
        .get().count;
      const avgTicketsPerEvent = db
        .prepare(
          `
            SELECT COALESCE(AVG(ticket_count), 0) as avgTickets
            FROM (
              SELECT e.id, COUNT(t.id) as ticket_count
              FROM events e
              LEFT JOIN tickets t ON t.event_id = e.id
              WHERE e.deleted_at IS NULL
              GROUP BY e.id
            )
          `
        )
        .get().avgTickets;

      const categories = db
        .prepare(
          `
            SELECT c.id, c.name, c.icon, c.color, COUNT(e.id) as count
            FROM categories c
            LEFT JOIN events e ON e.category_id = c.id AND e.deleted_at IS NULL
            GROUP BY c.id
            ORDER BY count DESC
          `
        )
        .all();

      const totalCategoryEvents = categories.reduce((sum, c) => sum + c.count, 0) || 1;
      const categoryDistribution = categories.map((c) => ({
        name: c.name,
        icon: c.icon || '📁',
        count: c.count,
        percentage: Math.round((c.count / totalCategoryEvents) * 100)
      }));

      const organizers = db
        .prepare(
          `
            SELECT u.id, u.name, u.email,
                   COUNT(DISTINCT e.id) as event_count,
                   COUNT(tk.id) as attendee_count,
                   COALESCE(SUM(CASE WHEN tr.status = 'completed' AND rf.id IS NULL THEN tr.amount_cents ELSE 0 END), 0) as revenue_cents
            FROM users u
            LEFT JOIN events e ON e.organizer_id = u.id AND e.deleted_at IS NULL
            LEFT JOIN tickets tk ON tk.event_id = e.id
            LEFT JOIN transactions tr ON tr.ticket_id = tk.id
            LEFT JOIN refunds rf ON rf.transaction_id = tr.id
            WHERE u.status != 'deleted' OR u.status IS NULL
            GROUP BY u.id
            HAVING event_count > 0
            ORDER BY revenue_cents DESC
            LIMIT 5
          `
        )
        .all();

      const ratings = db
        .prepare(
          `
            SELECT e.organizer_id as organizer_id, AVG(r.rating) as avg_rating
            FROM reviews r
            JOIN events e ON e.id = r.event_id
            WHERE r.status = 'approved' AND r.deleted_at IS NULL
            GROUP BY e.organizer_id
          `
        )
        .all();

      const ratingsMap = new Map(ratings.map((r) => [r.organizer_id, r.avg_rating]));

      const topOrganizers = organizers.map((o) => ({
        id: o.id,
        name: o.name || o.email?.split('@')[0] || 'Organizer',
        email: o.email || '',
        event_count: o.event_count,
        attendee_count: o.attendee_count,
        revenue: o.revenue_cents / 100,
        avg_rating: ratingsMap.get(o.id) || null
      }));

      res.json({
        stats: {
          totalRevenue: totalRevenueCents / 100,
          revenueGrowth: 12,
          activeUsers,
          newUsersThisMonth,
          eventsThisMonth,
          upcomingEvents,
          avgTicketsPerEvent: Number(avgTicketsPerEvent.toFixed(1))
        },
        categoryDistribution,
        topOrganizers
      });
    } catch (err) {
      next(err);
    }
  },

  async getActivity(req, res, next) {
    try {
      const limit = parseInt(req.query.limit || '50', 10);
      const logs = db
        .prepare(
          `
            SELECT a.*, u.name as actor_name, u.email as actor_email
            FROM audit_log a
            LEFT JOIN users u ON u.id = a.actor_user_id
            ORDER BY a.created_at DESC
            LIMIT ?
          `
        )
        .all(limit);

      const activity = logs.map((log) => ({
        id: log.id,
        actor_name: log.actor_name || log.actor_email || 'System',
        actor_email: log.actor_email,
        action: log.action,
        target_type: log.target_type,
        target_id: log.target_id,
        ip_address: log.ip_address,
        details: log.details ? JSON.parse(log.details) : null,
        created_at: log.created_at
      }));

      res.json({ activity });
    } catch (err) {
      next(err);
    }
  }
};

export default adminController;
