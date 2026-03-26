import db from '../config/db.js';
import auditService from '../services/auditService.js';

const registrationController = {
  async create(req, res, next) {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ error: 'Authentication required' })

      const { event_id, ticket_id, quantity = 1 } = req.body
      const event = db.prepare('SELECT * FROM events WHERE id = ? AND deleted_at IS NULL').get(event_id)
      if (!event) return res.status(404).json({ error: 'Event not found' })

      const remaining = event.remaining_capacity !== undefined ? event.remaining_capacity : event.total_capacity
      if (remaining <= 0) return res.status(400).json({ error: 'Event is sold out' })
      if (quantity > (remaining)) return res.status(400).json({ error: 'Not enough tickets available' })

      const priceCents = event.price_cents || 0
      const totalCents = priceCents * quantity

      // Insert tickets (one row per ticket)
      const insertTicket = db.prepare('INSERT INTO tickets (event_id, user_id, purchased_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
      const ticketIds = []
      const insertTxn = db.prepare('INSERT INTO transactions (user_id, ticket_id, amount_cents, status, method, currency, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)')

      const insertMany = db.transaction(() => {
        for (let i = 0; i < quantity; i++) {
          const info = insertTicket.run(event_id, userId)
          ticketIds.push(info.lastInsertRowid)
        }

        // Create one transaction referencing the first ticket (simple)
        const txnStatus = totalCents > 0 ? 'completed' : 'completed'
        insertTxn.run(userId, ticketIds[0] || null, totalCents, txnStatus, 'card', 'USD')

        // Decrement capacity
        const newRemaining = Math.max(0, (remaining || 0) - quantity)
        db.prepare('UPDATE events SET remaining_capacity = ? WHERE id = ?').run(newRemaining, event_id)
      })

      insertMany()

      auditService.log({
        actorUserId: userId,
        action: 'registration.create',
        targetType: 'event',
        targetId: event_id,
        ipAddress: req.ip,
        details: { quantity }
      })

      res.status(201).json({ id: ticketIds[0] || null, total_amount: totalCents / 100 })
    } catch (err) {
      next(err)
    }
  },

  async myRegistrations(req, res, next) {
    try {
      const userId = req.user?.id
      if (!userId) return res.status(401).json({ error: 'Authentication required' })

      const rows = db.prepare(`
        SELECT t.id as ticket_id, t.purchased_at, e.id as event_id, e.name as event_name, e.date as event_date, e.location, e.image_url, t.user_id
        FROM tickets t
        JOIN events e ON e.id = t.event_id
        WHERE t.user_id = ?
        ORDER BY t.purchased_at DESC
      `).all(userId)

      const formatted = rows.map(r => ({
        id: r.ticket_id,
        event_id: r.event_id,
        event_title: r.event_name,
        event_date: r.event_date,
        location: r.location,
        image: r.image_url,
        purchased_at: r.purchased_at
      }))

      res.json(formatted)
    } catch (err) {
      next(err)
    }
  },

  async get(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10)
      const row = db.prepare(`
        SELECT t.id as ticket_id, t.purchased_at, e.id as event_id, e.name as event_name, e.date as event_date, e.location, e.image_url
        FROM tickets t
        JOIN events e ON e.id = t.event_id
        WHERE t.id = ?
      `).get(id)

      if (!row) return res.status(404).json({ error: 'Registration not found' })

      res.json({
        id: row.ticket_id,
        event: {
          id: row.event_id,
          title: row.event_name,
          date: row.event_date,
          location: row.location,
          image: row.image_url
        },
        purchased_at: row.purchased_at
      })
    } catch (err) {
      next(err)
    }
  }
}

export default registrationController
