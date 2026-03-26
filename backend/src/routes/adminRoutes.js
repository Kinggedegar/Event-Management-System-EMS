// src/routes/adminRoutes.js
import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import adminController from '../controllers/adminController.js';

const router = Router();

// Require authentication and admin privileges for all admin routes
router.use(authMiddleware);
router.use(requireAdmin);

// Dashboard + monitoring
router.get('/stats', adminController.getStats);
router.get('/reports', adminController.getReports);
router.get('/activity', adminController.getActivity);

// Users
router.get('/users', adminController.listUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Events
router.get('/events', adminController.listEvents);
router.post('/events', adminController.createEvent);
router.put('/events/:id/status', adminController.updateEventStatus);
router.put('/events/:id/feature', adminController.featureEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Payments
router.get('/payments', adminController.listPayments);

// Reviews
router.get('/reviews', adminController.listReviews);
router.put('/reviews/:id/approve', adminController.approveReview);
router.put('/reviews/:id/reject', adminController.rejectReview);
router.delete('/reviews/:id', adminController.deleteReview);

// Booking/vendor + attendance (kept for existing flows)
router.post('/vendor-bookings', adminController.bookVendorSpace);
router.post('/attendance/scan', adminController.scanAttendance);

export default router;
