// src/controllers/authController.js
import authService from '../services/authService.js';
import auditService from '../services/auditService.js';

const authController = {
    /**
     * Register a new user (now supports optional role)
     * Role can be 'user' (default), 'admin', or 'superadmin'
     * In production, restrict 'admin'/'superadmin' to superadmin-only or via admin panel
     */
    async register(req, res, next) {
        try {
            const { email, password, role = 'attendee', name, phone } = req.body;

            // Basic role validation
            const allowedRoles = ['attendee', 'organizer', 'admin', 'superadmin'];
            if (!allowedRoles.includes(role)) {
                const err = new Error(`Invalid role. Allowed: ${allowedRoles.join(', ')}`);
                err.statusCode = 400;
                return next(err);
            }

            // For security: in production, only allow 'attendee' during self-registration
            // 'admin' and 'superadmin' should be assigned by superadmin later
            // Normalize role and pass to authService
            const normalizedRole = String(role || 'attendee').trim().toLowerCase()
            const result = await authService.register(email, password, normalizedRole, name, phone);
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            auditService.log({
                actorUserId: result.user?.id,
                action: 'user.register',
                targetType: 'user',
                targetId: result.user?.id,
                ipAddress: req.ip
            });

            res.status(201).json({
                message: 'Account created successfully',
                token: result.token,
                user: result.user
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Login user and set HttpOnly cookie
     */
    async login(req, res, next) {
        try {
            const { token, user } = await authService.login(
                req.body.email,
                req.body.password
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            auditService.log({
                actorUserId: user?.id,
                action: 'user.login',
                targetType: 'user',
                targetId: user?.id,
                ipAddress: req.ip
            });

            res.json({
                message: 'Login successful',
                token,
                user
            });
        } catch (err) {
            next(err);
        }
    },

    /**
     * Logout – clear cookie
     */
    logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        auditService.log({
            actorUserId: req.user?.id || null,
            action: 'user.logout',
            targetType: 'user',
            targetId: req.user?.id || null,
            ipAddress: req.ip
        });
        res.json({ message: 'Logged out successfully' });
    }
};

export default authController;
