// src/services/eventService.js
import db from '../config/db.js';

const eventService = {
  createEvent({
    name,
    totalCapacity,
    priceCents,
    description = null,
    location = null,
    date = null,
    categoryId = null,
    imageUrl = null,
    organizerId = null,
    status = 'draft'
  }) {
    if (!name || !totalCapacity || priceCents === undefined) {
      const err = new Error('name, totalCapacity, and priceCents are required');
      err.statusCode = 400;
      throw err;
    }

    const eventDate = date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const result = db
      .prepare(
        `
          INSERT INTO events
            (name, description, total_capacity, remaining_capacity, price_cents, location, date, status, category_id, image_url, organizer_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .run(
        name,
        description,
        totalCapacity,
        totalCapacity,
        priceCents,
        location,
        eventDate,
        status,
        categoryId,
        imageUrl,
        organizerId
      );

    const eventId = result.lastInsertRowid;
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);

    return {
      eventId,
      event: {
        id: event.id,
        title: event.name,
        description: event.description,
        total_capacity: event.total_capacity,
        remaining_capacity: event.remaining_capacity,
        price_cents: event.price_cents,
        location: event.location,
        event_date: event.date,
        status: event.status,
        category_id: event.category_id,
        image_url: event.image_url,
        organizer_id: event.organizer_id,
        created_at: event.created_at,
        updated_at: event.updated_at
      }
    };
  },

  updateEvent(eventId, updates) {
    // TODO: implement with optimistic locking
    return { eventId, updated: false };
  },

  deleteEvent(eventId) {
    // TODO: implement with checks for existing bookings/tickets
    return { eventId, deleted: false };
  }
};

export default eventService;
