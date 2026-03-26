import { Router } from 'express'
import authMiddleware from '../middleware/auth.js'
import requireOrganizer from '../middleware/requireOrganizer.js'
import eventService from '../services/eventService.js'
import db from '../config/db.js'
import optionalAuth from '../middleware/optionalAuth.js'

const router = Router()

// Create event (organizer or admin)
router.post('/', authMiddleware, requireOrganizer, (req, res, next) => {
  try {
    const payload = {
      name: req.body.title || req.body.name,
      description: req.body.description || null,
      totalCapacity: req.body.capacity || req.body.total_capacity || 100,
      priceCents: Math.round((req.body.price_cents || req.body.price || 0) * 100) || 0,
      location: req.body.location || null,
      date: req.body.event_date || req.body.date || null,
      categoryId: req.body.category_id || null,
      imageUrl: req.body.image_url || null,
      organizerId: req.user.id,
      // Admins can directly publish; organizers create drafts that admins approve
      status: ['admin', 'superadmin'].includes(req.user.role) ? 'active' : 'draft'
    }

    const result = eventService.createEvent(payload)
    res.status(201).json({ event: result.event })
  } catch (err) {
    next(err)
  }
})

// Public: upcoming events (used by frontend homepage)
router.get('/upcoming', (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '8', 10)
    const rows = db.prepare("SELECT * FROM events WHERE date >= datetime('now') AND status = 'active' AND deleted_at IS NULL ORDER BY date ASC LIMIT ?").all(limit)
    const events = rows.map((e) => ({
      id: e.id,
      title: e.name,
      description: e.description,
      date: e.date,
      event_date: e.date,
      location: e.location,
      status: e.status,
      image: e.image_url || e.image_url,
      image_url: e.image_url,
      category_id: e.category_id,
      price: (e.price_cents || 0) / 100,
      registration_count: db.prepare('SELECT COUNT(*) as c FROM tickets WHERE event_id = ?').get(e.id).c || 0
    }))
    res.json(events)
  } catch (err) {
    next(err)
  }
})

// Public: list events (paginated). If the request is authenticated, include the user's own events
router.get('/', optionalAuth, (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10))
    const limit = Math.max(1, parseInt(req.query.limit || '12', 10))
    const offset = (page - 1) * limit

    const params = []
    let where = "WHERE e.deleted_at IS NULL AND (e.status = 'active'"
    if (req.user && req.user.id) {
      where += ' OR e.organizer_id = ?'
      params.push(req.user.id)
    }
    where += ')'

    if (req.query.search) {
      where += " AND (e.name LIKE ? OR e.description LIKE ?)"
      params.push(`%${req.query.search}%`, `%${req.query.search}%`)
    }
    if (req.query.category) {
      where += ' AND e.category_id = ?'
      params.push(parseInt(req.query.category, 10))
    }
    if (req.query.city) {
      where += ' AND e.city = ?'
      params.push(req.query.city)
    }
    if (req.query.featured) {
      where += " AND e.featured = 1"
    }

    // sorting
    let order = 'ORDER BY e.date ASC'
    if (req.query.sort === 'title') order = 'ORDER BY e.name ASC'
    if (req.query.sort === 'created_at') order = 'ORDER BY e.created_at DESC'

    const totalRow = db.prepare(`SELECT COUNT(*) as c FROM events e ${where}`).get(...params)
    const total = totalRow?.c || 0

    const rows = db.prepare(`SELECT e.* FROM events e ${where} ${order} LIMIT ? OFFSET ?`).all(...params, limit, offset)

    const events = rows.map((e) => ({
      id: e.id,
      title: e.name,
      description: e.description,
      date: e.date,
      event_date: e.date,
      location: e.location,
      status: e.status,
      image: e.image_url || e.image_url,
      image_url: e.image_url,
      category_id: e.category_id,
      price: (e.price_cents || 0) / 100,
      registration_count: db.prepare('SELECT COUNT(*) as c FROM tickets WHERE event_id = ?').get(e.id).c || 0,
      organizer_id: e.organizer_id
    }))

    res.json({ events, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err) {
    next(err)
  }
})

// Public: featured events
router.get('/featured', (req, res, next) => {
  try {
    const rows = db.prepare("SELECT * FROM events WHERE featured = 1 AND status = 'active' AND deleted_at IS NULL ORDER BY date ASC LIMIT 6").all()
    const events = rows.map((e) => ({
      id: e.id,
      title: e.name,
      description: e.description,
      date: e.date,
      event_date: e.date,
      location: e.location,
      status: e.status,
      image: e.image_url || e.image_url,
      image_url: e.image_url,
      category_id: e.category_id,
      price: (e.price_cents || 0) / 100,
      registration_count: db.prepare('SELECT COUNT(*) as c FROM tickets WHERE event_id = ?').get(e.id).c || 0
    }))
    res.json(events)
  } catch (err) {
    next(err)
  }
})

// Get events for the authenticated organizer
router.get('/my-events', authMiddleware, requireOrganizer, (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM events WHERE organizer_id = ? AND deleted_at IS NULL ORDER BY created_at DESC').all(req.user.id)
    const events = rows.map((e) => ({
      id: e.id,
      title: e.name,
      description: e.description,
      event_date: e.date,
      location: e.location,
      status: e.status,
      image_url: e.image_url,
      category_id: e.category_id,
      registration_count: db.prepare('SELECT COUNT(*) as c FROM tickets WHERE event_id = ?').get(e.id).c || 0,
      revenue: (db.prepare("SELECT COALESCE(SUM(amount_cents),0) as total FROM transactions t JOIN tickets tk ON tk.id = t.ticket_id WHERE tk.event_id = ? AND t.status = 'completed'").get(e.id).total || 0) / 100
    }))

    res.json({ events })
  } catch (err) {
    next(err)
  }
})

// Organizer stats (simple overview)
router.get('/organizer-stats', authMiddleware, requireOrganizer, (req, res, next) => {
  try {
    const totalEvents = db.prepare('SELECT COUNT(*) as c FROM events WHERE organizer_id = ? AND deleted_at IS NULL').get(req.user.id).c || 0
    const totalAttendees = db.prepare('SELECT COUNT(*) as c FROM tickets tk JOIN events e ON e.id = tk.event_id WHERE e.organizer_id = ?').get(req.user.id).c || 0
    const totalRevenueCents = db.prepare("SELECT COALESCE(SUM(t.amount_cents),0) as total FROM transactions t JOIN tickets tk ON tk.id = t.ticket_id JOIN events e ON e.id = tk.event_id WHERE e.organizer_id = ? AND t.status = 'completed'").get(req.user.id).total || 0

    res.json({ totalEvents, totalAttendees, totalRevenue: totalRevenueCents / 100 })
  } catch (err) {
    next(err)
  }
})

// Public: get event by id
router.get('/:id', optionalAuth, (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    const e = db.prepare('SELECT * FROM events WHERE id = ? AND deleted_at IS NULL').get(id)
    if (!e) return res.status(404).json({ error: 'Event not found' })

    // If event is not active, only allow organizer or admin to view
    if (e.status !== 'active') {
      const isOwner = req.user && req.user.id === e.organizer_id
      const isAdmin = req.user && ['admin', 'superadmin'].includes(req.user.role)
      if (!isOwner && !isAdmin) {
        return res.status(404).json({ error: 'Event not found' })
      }
    }

    const registrationCount = db.prepare('SELECT COUNT(*) as c FROM tickets WHERE event_id = ?').get(e.id).c || 0
    const revenue = (db.prepare("SELECT COALESCE(SUM(t.amount_cents),0) as total FROM transactions t JOIN tickets tk ON tk.id = t.ticket_id WHERE tk.event_id = ? AND t.status = 'completed'").get(e.id).total || 0) / 100

    // Build a simple tickets payload so the frontend can render ticket types.
    const sold = db.prepare('SELECT COUNT(*) as c FROM tickets WHERE event_id = ?').get(e.id).c || 0
    const remaining = e.remaining_capacity !== undefined ? e.remaining_capacity : e.total_capacity

    const tickets = [
      {
        id: `ga-${e.id}`,
        name: 'General Admission',
        price: (e.price_cents || 0) / 100,
        quantity: remaining,
        sold: sold,
        max_per_order: 10
      }
    ]

    res.json({
      id: e.id,
      title: e.name,
      description: e.description,
      date: e.date,
      event_date: e.date,
      time: e.time || null,
      end_date: e.end_date || null,
      end_time: e.end_time || null,
      location: e.location,
      address: e.address || null,
      city: e.city || null,
      status: e.status,
      image: e.image_url || null,
      image_url: e.image_url || null,
      category_id: e.category_id,
      price: (e.price_cents || 0) / 100,
      registration_count: registrationCount,
      revenue,
      tickets
    })
  } catch (err) {
    next(err)
  }
})

export default router
