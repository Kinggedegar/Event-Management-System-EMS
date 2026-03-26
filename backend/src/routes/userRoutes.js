import { Router } from 'express';
import userController from '../controllers/userController.js';
import bookingController from '../controllers/bookingController.js';  // ← ADD THIS
import authMiddleware from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import idempotencyMiddleware from '../middleware/idempotency.js';
import db from '../config/db.js';

const router = Router();

router.use(authMiddleware);

// ... your existing routes ...

router.post('/bookings', bookingController.bookSpace); 
router.post('/expectations', userController.submitExpectation); // ← ADD THIS LINE
// ────────────────────────────────────────────────
// Personal user endpoints
// ────────────────────────────────────────────────

// Get current user's profile
router.get('/me', userController.getProfile);
router.put('/profile', validate(schemas.updateProfile), userController.updateProfile);
router.put('/password', validate(schemas.changePassword), userController.changePassword);
router.delete('/account', userController.deleteAccount);

// Get list of tickets owned by the current user
router.get('/tickets', userController.getMyTickets);

// Purchase a ticket (with idempotency protection)
router.post(
    '/tickets/purchase',
    validate(schemas.purchase),
    idempotencyMiddleware,
    userController.purchaseTicket
);

// Get QR code for a specific ticket (only if owned by user)
router.get('/tickets/:ticketId/qr', userController.getTicketQR);

// Optional: Let frontend easily check current user's role
// (useful after adding role column to users table)
router.get('/my-role', (req, res) => {
    // If role is not yet in req.user, fetch it from DB
    const userRole = req.user.role ||
        db.prepare('SELECT role FROM users WHERE id = ?')
            .get(req.user.id)?.role ||
        'user'; // fallback

    res.json({ role: userRole });
});

export default router;
