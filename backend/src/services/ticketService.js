// src/services/ticketService.js
import db from '../config/db.js';

const ticketService = {
    /**
     * Purchase a ticket atomically with optimistic concurrency control
     * @param {number} userId - ID of the purchasing user
     * @param {number} eventId - ID of the event
     * @returns {Promise<object>} Purchase result with ticket details
     */
    async purchaseTicket(userId, eventId) {
        const startTime = Date.now();
        console.log(`[TICKET PURCHASE] START - userId:${userId}, eventId:${eventId}, time:${new Date().toISOString()}`);

        let result;
        try {
            // Execute the entire purchase inside a transaction
            result = db.transaction(() => {
                console.log('[TICKET] Entered transaction block');

                // 1. Fetch current event state (price, capacity, version)
                console.log('[TICKET] Fetching event data');
                const event = db
                    .prepare('SELECT remaining_capacity, price_cents, version FROM events WHERE id = ?')
                    .get(eventId);

                if (!event) {
                    console.log('[TICKET] Event not found');
                    const err = new Error('Event not found');
                    err.statusCode = 404;
                    throw err;
                }

                console.log(
                    '[TICKET] Event found → remaining:', event.remaining_capacity,
                    'price_cents:', event.price_cents,
                    'version:', event.version
                );

                if (event.remaining_capacity < 1) {
                    console.log('[TICKET] No tickets remaining');
                    const err = new Error('No tickets remaining');
                    err.statusCode = 409;
                    throw err;
                }

                // 2. Atomic decrement with optimistic concurrency check
                console.log('[TICKET] Attempting optimistic UPDATE with version check');
                const updateResult = db
                    .prepare(`
            UPDATE events 
            SET remaining_capacity = remaining_capacity - 1,
                version = version + 1
            WHERE id = ? 
              AND version = ? 
              AND remaining_capacity > 0
          `)
                    .run(eventId, event.version);

                console.log('[TICKET] UPDATE affected rows:', updateResult.changes);

                if (updateResult.changes === 0) {
                    console.log('[TICKET] Concurrency conflict - no rows updated');
                    const err = new Error('Ticket no longer available (concurrency race) – please retry');
                    err.statusCode = 409;
                    throw err;
                }

                // 3. Create ticket record
                console.log('[TICKET] Inserting ticket record');
                const ticketResult = db
                    .prepare('INSERT INTO tickets (event_id, user_id) VALUES (?, ?)')
                    .run(eventId, userId);
                const ticketId = ticketResult.lastInsertRowid;
                console.log('[TICKET] Ticket created → ID:', ticketId);

                // 4. Record transaction
                console.log('[TICKET] Inserting transaction record');
                db
                    .prepare('INSERT INTO transactions (user_id, ticket_id, amount_cents, status) VALUES (?, ?, ?, "completed")')
                    .run(userId, ticketId, event.price_cents);

                // 5. Immutable audit ledger entry
                console.log('[TICKET] Inserting ledger entry');
                db
                    .prepare(`
            INSERT INTO ledger 
              (event_id, user_id, action, quantity_changed, previous_capacity, new_capacity)
            VALUES (?, ?, 'TICKET_PURCHASE', 1, ?, ?)
          `)
                    .run(eventId, userId, event.remaining_capacity, event.remaining_capacity - 1);

                console.log('[TICKET] All operations complete - preparing success response');

                return {
                    success: true,
                    ticketId,
                    eventId,
                    amountCents: event.price_cents,
                    message: 'Ticket purchased successfully'
                };
            })(); // Execute the transaction function

            console.log(`[TICKET PURCHASE] FINISHED successfully in ${Date.now() - startTime}ms`);
            return result;
        } catch (err) {
            const duration = Date.now() - startTime;
            console.error(`[TICKET PURCHASE] FAILED after ${duration}ms:`, err.message);
            console.error('[TICKET] Full stack:', err.stack);

            // Special handling for common SQLite lock errors
            if (err.message?.includes('SQLITE_BUSY') || err.message?.includes('database is locked')) {
                console.error('[TICKET] SQLITE_BUSY / LOCKED detected → likely contention');
            }

            throw err; // Re-throw so controller/global error handler can catch and respond
        }
    }
};

export default ticketService;