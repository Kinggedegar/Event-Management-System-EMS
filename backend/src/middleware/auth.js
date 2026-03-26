// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in .env');
}

const authMiddleware = (req, res, next) => {
    // Try to get token from cookie first (HttpOnly cookie from login)
    let token = req.cookies?.token;

    // Fallback: support Bearer token in Authorization header (useful for API testing)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        const err = new Error('Authentication required – no token provided');
        err.statusCode = 401;
        err.code = 'NO_TOKEN';
        return next(err);
    }

    try {
        // Verify the JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch full user from database (including role)
        const user = db
            .prepare('SELECT id, email, role, status FROM users WHERE id = ?')
            .get(decoded.userId);

        if (!user) {
            const err = new Error('User no longer exists');
            err.statusCode = 401;
            err.code = 'USER_NOT_FOUND';
            return next(err);
        }

        if (user.status === 'suspended') {
            const err = new Error('Account suspended');
            err.statusCode = 403;
            err.code = 'ACCOUNT_SUSPENDED';
            return next(err);
        }

        if (user.status === 'deleted') {
            const err = new Error('Account deactivated');
            err.statusCode = 403;
            err.code = 'ACCOUNT_DELETED';
            return next(err);
        }

        // Attach user data to request (including role)
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role || 'user'   // fallback if role column is missing
        };

        // Optional debug log (remove or wrap in if (process.env.NODE_ENV === 'development'))
        console.log(`[AUTH] User authenticated: ${user.email} (role: ${user.role})`);

        next();
    } catch (err) {
        let statusCode = 401;
        let message = 'Invalid or expired token';
        let code = 'INVALID_TOKEN';

        if (err.name === 'TokenExpiredError') {
            message = 'Token has expired – please log in again';
            code = 'TOKEN_EXPIRED';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Malformed or invalid token';
            code = 'INVALID_JWT';
        }

        const error = new Error(message);
        error.statusCode = statusCode;
        error.code = code;
        error.originalError = err.message; // only for server logs

        console.warn(`[AUTH] Verification failed: ${message} – ${err.message}`);
        next(error);
    }
};

export default authMiddleware;
