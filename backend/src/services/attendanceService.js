// src/services/attendanceService.js
import db from '../config/db.js';

const attendanceService = {
    recordAttendance(ticketId, bookingId, userId, eventId) {
        return db.transaction(() => {
            const existing = db
                .prepare('SELECT id FROM attendance WHERE ticket_id = ? OR booking_id = ?')
                .get(ticketId, bookingId);

            if (existing) {
                throw new Error('Attendance already recorded');
            }

            const result = db
                .prepare('INSERT INTO attendance (ticket_id, booking_id, user_id, event_id) VALUES (?, ?, ?, ?)')
                .run(ticketId, bookingId, userId, eventId);

            // TODO: Notify organizer via email or webhook

            return { attendanceId: result.lastInsertRowid, scannedAt: new Date().toISOString() };
        })();
    }
};

export default attendanceService;