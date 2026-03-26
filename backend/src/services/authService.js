// src/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

const authService = {
    /**
     * Register new user - now accepts and saves role
     */
    async register(email, password, role = 'attendee', name = null, phone = null) {
        // Validate role (extra safety layer)
        const allowedRoles = ['attendee', 'organizer', 'admin', 'superadmin'];
        if (!allowedRoles.includes(role)) {
            const err = new Error(`Invalid role. Allowed: ${allowedRoles.join(', ')}`);
            err.statusCode = 400;
            throw err;
        }

        const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (exists) {
            const err = new Error('Email already registered');
            err.statusCode = 409;
            throw err;
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        const result = db.prepare(
            'INSERT INTO users (email, password_hash, role, name, phone, status) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(email, password_hash, role, name, phone, 'active');

        const token = jwt.sign(
            { userId: result.lastInsertRowid, email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: result.lastInsertRowid,
                email,
                role,
                name,
                phone,
                status: 'active'
            }
        };
    },

    /**
     * Login - returns token + user
     */
    async login(email, password) {
        const user = db.prepare(
            'SELECT id, password_hash, email, role, name, phone, status FROM users WHERE email = ?'
        ).get(email);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            const err = new Error('Invalid credentials');
            err.statusCode = 401;
            throw err;
        }

        if (user.status === 'suspended') {
            const err = new Error('Account suspended');
            err.statusCode = 403;
            throw err;
        }

        if (user.status === 'deleted') {
            const err = new Error('Account deactivated');
            err.statusCode = 403;
            throw err;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Map legacy 'user' role to 'attendee' for frontend compatibility
        const role = (user.role === 'user') ? 'attendee' : (user.role || 'attendee');

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role,
                name: user.name || null,
                phone: user.phone || null,
                status: user.status || 'active'
            }
        };
    },

    logout() {
        return { success: true };
    }
};

export default authService;
