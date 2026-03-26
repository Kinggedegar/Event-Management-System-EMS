// src/routes/paymentRoutes.js
import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import adminController from '../controllers/adminController.js';
import db from '../config/db.js';

const router = Router();

// Allow authenticated users to process payments for their registrations
router.post('/process', authMiddleware, async (req, res, next) => {
	try {
		const { registration_id, method = 'card', payment_details = null } = req.body
		// Very simple mock: mark transaction(s) for registration as completed
		// In this simplified model we locate a transaction by ticket -> registration id (ticket id)
		const txn = db.prepare('SELECT * FROM transactions WHERE ticket_id = ?').get(registration_id)
		if (!txn) {
			// If not found, create a completed transaction placeholder
			const amountCents = 0
			const info = db.prepare('INSERT INTO transactions (user_id, ticket_id, amount_cents, status, method, currency, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)').run(req.user.id, registration_id, amountCents, 'completed', method, 'USD')
			return res.json({ success: true, id: info.lastInsertRowid })
		}
		db.prepare('UPDATE transactions SET status = ?, method = ? WHERE id = ?').run('completed', method, txn.id)
		return res.json({ success: true, id: txn.id })
	} catch (err) {
		next(err)
	}
})

// Admin-only routes
router.use(authMiddleware);
router.use(requireAdmin);

router.post('/:id/refund', adminController.refundPayment);

export default router;
