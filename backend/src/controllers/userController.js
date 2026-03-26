// src/controllers/userController.js
import bcrypt from 'bcryptjs';
import ticketService from '../services/ticketService.js';
import qrService from '../services/qrService.js';
import expectationService from '../services/expectationService.js'; // ← new import
import db from '../config/db.js';
import auditService from '../services/auditService.js';

const userController = {
  /**
   * Get current user's profile (includes role)
   */
  async getProfile(req, res, next) {
    try {
      const user = db
        .prepare('SELECT id, email, role, name, phone, status, created_at FROM users WHERE id = ?')
        .get(req.user.id);

      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        return next(err);
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role || 'user', // fallback if role is missing
        name: user.name || null,
        phone: user.phone || null,
        status: user.status || 'active',
        created_at: user.created_at
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update current user's profile
   */
  async updateProfile(req, res, next) {
    try {
      const { name, email, phone } = req.body;

      if (name === undefined && email === undefined && phone === undefined) {
        const err = new Error('At least one field (name, email, phone) is required');
        err.statusCode = 400;
        return next(err);
      }

      if (email) {
        const emailToCheck = typeof email === 'string' ? email.trim().toLowerCase() : email;
        const existing = db
          .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
          .get(emailToCheck, req.user.id);
        if (existing) {
          const err = new Error('Email already in use');
          err.statusCode = 409;
          return next(err);
        }
      }

      const updates = [];
      const values = [];

      if (name !== undefined) {
        let normalizedName = typeof name === 'string' ? name.trim() : name;
        if (normalizedName === '') normalizedName = null;
        updates.push('name = ?');
        values.push(normalizedName);
      }

      if (email !== undefined) {
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
        if (normalizedEmail === '') {
          const err = new Error('Email cannot be empty');
          err.statusCode = 400;
          return next(err);
        }
        updates.push('email = ?');
        values.push(normalizedEmail);
      }

      if (phone !== undefined) {
        let normalizedPhone = typeof phone === 'string' ? phone.trim() : phone;
        if (normalizedPhone === '') normalizedPhone = null;
        updates.push('phone = ?');
        values.push(normalizedPhone);
      }

      if (updates.length > 0) {
        db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
          .run(...values, req.user.id);
      }

      const updatedUser = db
        .prepare('SELECT id, email, role, name, phone, status, created_at FROM users WHERE id = ?')
        .get(req.user.id);

      res.json({ user: updatedUser });

      auditService.log({
        actorUserId: req.user.id,
        action: 'user.profile.update',
        targetType: 'user',
        targetId: req.user.id,
        ipAddress: req.ip,
        details: { updatedFields: Object.keys(req.body || {}) }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Change current user's password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = db
        .prepare('SELECT id, password_hash FROM users WHERE id = ?')
        .get(req.user.id);

      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        return next(err);
      }

      const matches = await bcrypt.compare(currentPassword, user.password_hash);
      if (!matches) {
        const err = new Error('Current password is incorrect');
        err.statusCode = 400;
        return next(err);
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
        .run(newHash, req.user.id);

      res.json({ success: true, message: 'Password updated' });

      auditService.log({
        actorUserId: req.user.id,
        action: 'user.password.change',
        targetType: 'user',
        targetId: req.user.id,
        ipAddress: req.ip
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete current user's account
   */
  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;

      db.prepare("UPDATE users SET status = 'deleted', deleted_at = datetime('now') WHERE id = ?").run(userId);

      res.json({ success: true, message: 'Account deactivated' });

      auditService.log({
        actorUserId: userId,
        action: 'user.delete.self',
        targetType: 'user',
        targetId: userId,
        ipAddress: req.ip
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get list of tickets owned by the current user
   */
  async getMyTickets(req, res, next) {
    try {
      const tickets = db
        .prepare(`
          SELECT 
            t.id, 
            t.event_id, 
            e.name as event_name, 
            e.price_cents, 
            t.purchased_at 
          FROM tickets t 
          JOIN events e ON t.event_id = e.id 
          WHERE t.user_id = ?
          ORDER BY t.purchased_at DESC
        `)
        .all(req.user.id);

      res.json({ tickets });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Purchase a ticket (atomic + idempotent via middleware)
   */
  async purchaseTicket(req, res, next) {
    try {
      // Optional future restriction: only 'user' role can buy tickets
      // if (req.user.role !== 'user') {
      //   const err = new Error('Only regular users can purchase tickets');
      //   err.statusCode = 403;
      //   return next(err);
      // }

      const result = ticketService.purchaseTicket(req.user.id, req.body.eventId);
      const qr = await qrService.generateForTicket(result.ticketId, req.user.id);

      res.status(201).json({
        success: true,
        ticketId: result.ticketId,
        eventId: result.eventId,
        amountCents: result.amountCents,
        message: 'Ticket purchased successfully',
        qrCodeDataUrl: qr.qrCode,
        signedToken: qr.signedToken
      });

      auditService.log({
        actorUserId: req.user.id,
        action: 'ticket.purchase',
        targetType: 'event',
        targetId: result.eventId,
        ipAddress: req.ip,
        details: { ticketId: result.ticketId, amountCents: result.amountCents }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get QR code for a specific ticket (ownership verified)
   */
  async getTicketQR(req, res, next) {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);

      const ticket = db
        .prepare('SELECT id FROM tickets WHERE id = ? AND user_id = ?')
        .get(ticketId, req.user.id);

      if (!ticket) {
        const err = new Error('Ticket not found or access denied');
        err.statusCode = 404;
        return next(err);
      }

      const qr = await qrService.generateForTicket(ticketId, req.user.id);

      res.json({
        ticketId,
        signedToken: qr.signedToken,
        qrCodeDataUrl: qr.qrCode
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Submit attendee expectations for an event
   * This is separate from booking/ticket purchase
   */
  async submitExpectation(req, res, next) {
    try {
      const { eventId, expectationText } = req.body;

      if (!eventId || !expectationText || typeof expectationText !== 'string' || expectationText.trim() === '') {
        const err = new Error('eventId and expectationText are required and must be non-empty');
        err.statusCode = 400;
        return next(err);
      }

      const result = expectationService.submitExpectation(req.user.id, eventId, expectationText.trim());

      res.status(201).json({
        success: true,
        message: 'Expectation submitted successfully',
        expectationId: result.expectationId,
        eventId,
        userId: req.user.id
      });

      auditService.log({
        actorUserId: req.user.id,
        action: 'expectation.submit',
        targetType: 'event',
        targetId: eventId,
        ipAddress: req.ip,
        details: { expectationId: result.expectationId }
      });
    } catch (err) {
      next(err);
    }
  }
};

export default userController;
