// src/services/bookingService.js
import db from '../config/db.js';

const bookingService = {
    async bookSpace(userId, eventId, spaceType) {
        return db.transaction(() => {
            // Check event exists and has space
            const event = db
                .prepare('SELECT remaining_capacity, version FROM events WHERE id = ?')
                .get(eventId);

            if (!event) throw new Error('Event not found');
            if (event.remaining_capacity < 1) throw new Error('No space available');

            // Decrement capacity
            const updateResult = db
                .prepare(`
          UPDATE events 
          SET remaining_capacity = remaining_capacity - 1,
              version = version + 1
          WHERE id = ? AND version = ? AND remaining_capacity > 0
        `)
                .run(eventId, event.version);

            if (updateResult.changes === 0) {
                throw new Error('Booking failed - capacity changed');
            }

            // Create booking record
            const bookingResult = db
                .prepare('INSERT INTO bookings (event_id, user_id, space_type) VALUES (?, ?, ?)')
                .run(eventId, userId, spaceType);

            return { bookingId: bookingResult.lastInsertRowid };
        })();
    }
};

export default bookingService;