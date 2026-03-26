// src/controllers/bookingController.js
import bookingService from '../services/bookingService.js';
import auditService from '../services/auditService.js';

const bookingController = {
    async bookSpace(req, res, next) {
        try {
            const { eventId, spaceType } = req.body;

            if (!eventId || !spaceType) {
                const err = new Error('eventId and spaceType are required');
                err.statusCode = 400;
                return next(err);
            }

            const result = await bookingService.bookSpace(req.user.id, eventId, spaceType);

            res.status(201).json({
                success: true,
                bookingId: result.bookingId,
                eventId,
                spaceType,
                message: 'Space booked successfully'
            });

            auditService.log({
                actorUserId: req.user.id,
                action: 'booking.create',
                targetType: 'event',
                targetId: eventId,
                ipAddress: req.ip,
                details: { bookingId: result.bookingId, spaceType }
            });
        } catch (err) {
            next(err);
        }
    }
};

export default bookingController;
