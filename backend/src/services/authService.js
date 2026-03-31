import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

// Centralized System Constants
const SYSTEM_ROLES = ['attendee', 'organizer', 'admin', 'superadmin'];
const STATUS = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    DELETED: 'deleted'
};

/**
 * Internal Helper: Create a standardized JWT
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            userId: user.id, 
            email: user.email, 
            role: user.role // Including role in token for faster middleware checks
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const authService = {
    /**
     * Register a new identity node
     */
    async register(email, password, role = 'attendee', name = null, phone = null) {
        // 1. Role Validation
        if (!SYSTEM_ROLES.includes(role)) {
            const err = new Error(`Protocol Violation: Invalid role identifier [${role}]`);
            err.statusCode = 400;
            throw err;
        }

        // 2. Uniqueness Check
        const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (exists) {
            const err = new Error('Conflict detected: Email address already exists in database');
            err.statusCode = 409;
            throw err;
        }

        // 3. Security: Hash Password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // 4. Persistence
        const result = db.prepare(`
            INSERT INTO users (email, password_hash, role, name, phone, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(email, passwordHash, role, name, phone, STATUS.ACTIVE);

        const userId = result.lastInsertRowid;
        const userObj = { id: userId, email, role, name, phone, status: STATUS.ACTIVE };

        // 5. Authorization
        const token = generateToken(userObj);

        return { token, user: userObj };
    },

    /**
     * Authenticate and verify session
     */
    async login(email, password) {
        // 1. Retrieve Node Data
        const user = db.prepare(`
            SELECT id, password_hash, email, role, name, phone, status 
            FROM users 
            WHERE email = ?
        `).get(email);

        // 2. Handshake: Credentials Check
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            const err = new Error('Verification failed: Invalid email or access cipher');
            err.statusCode = 401;
            throw err;
        }

        // 3. Handshake: Status Check
        // If your account is showing "deactivated", it's because status is 'deleted'
        if (user.status === STATUS.SUSPENDED) {
            const err = new Error('Access Denied: Your account node has been suspended');
            err.statusCode = 403;
            throw err;
        }

        if (user.status === STATUS.DELETED) {
            const err = new Error('Access Denied: This account identity has been deactivated');
            err.statusCode = 403;
            throw err;
        }

        // 4. Compatibility mapping (legacy 'user' to 'attendee')
        const role = (user.role === 'user') ? 'attendee' : (user.role || 'attendee');

        // 5. Finalize Session
        const token = generateToken({ ...user, role });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role,
                name: user.name,
                phone: user.phone,
                status: user.status || STATUS.ACTIVE
            }
        };
    },

    /**
     * Terminate system session
     */
    logout() {
        return { success: true, message: 'Session terminated' };
    }
};

export default authService;