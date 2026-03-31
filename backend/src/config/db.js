import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.DB_PATH || path.join(__dirname, '../../ems.db');

console.log(`[SYSTEM] Initializing Core Database: ${dbPath}`);

const db = new Database(dbPath, {
    verbose: (msg) => console.log(`[SQL] ${msg}`),
});

/**
 * ══════════════════════════════════════════
 * DATABASE CONFIGURATION (PRAGMAS)
 * ══════════════════════════════════════════
 */
db.pragma('journal_mode = WAL'); // Performance
db.pragma('busy_timeout = 5000'); // Prevent locking
db.pragma('foreign_keys = ON');  // Integrity

/**
 * ══════════════════════════════════════════
 * CORE SCHEMA DEFINITION
 * ══════════════════════════════════════════
 */
const initializeSchema = () => {
    db.exec(`
        -- Identity Management
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            username TEXT UNIQUE,
            phone TEXT,
            role TEXT NOT NULL DEFAULT 'attendee' CHECK(role IN ('attendee', 'organizer', 'admin', 'superadmin')),
            status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'deleted')),
            bio TEXT,
            avatar_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted_at DATETIME
        );

        -- Event Modules
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            category_id INTEGER REFERENCES categories(id),
            organizer_id INTEGER REFERENCES users(id),
            total_capacity INTEGER NOT NULL,
            remaining_capacity INTEGER NOT NULL,
            price_cents INTEGER NOT NULL DEFAULT 0,
            location TEXT,
            image_url TEXT,
            event_date DATETIME NOT NULL,
            end_date DATETIME,
            status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'past', 'cancelled')),
            featured INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted_at DATETIME
        );

        -- Taxonomy
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            icon TEXT,
            color TEXT DEFAULT '#7c3aed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Financial Records
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            amount_cents INTEGER NOT NULL,
            currency TEXT DEFAULT 'USD',
            method TEXT DEFAULT 'card',
            status TEXT CHECK(status IN ('completed', 'pending', 'failed', 'refunded')),
            transaction_id TEXT UNIQUE,
            payment_details TEXT, -- JSON payload from gateway
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Access Tokens (Registrations)
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY,
            event_id INTEGER NOT NULL REFERENCES events(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            ticket_name TEXT,
            quantity INTEGER DEFAULT 1,
            total_amount REAL,
            status TEXT DEFAULT 'confirmed' CHECK(status IN ('pending', 'confirmed', 'cancelled', 'checked_in')),
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            checked_in_at DATETIME
        );

        -- Feedback Telemetry
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY,
            event_id INTEGER NOT NULL REFERENCES events(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            comment TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            deleted_at DATETIME
        );

        -- Performance Indices
        CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_event_status ON events(status);
        CREATE INDEX IF NOT EXISTS idx_registration_user ON registrations(user_id);
    `);
};

/**
 * ══════════════════════════════════════════
 * DYNAMIC MIGRATION HELPER
 * ══════════════════════════════════════════
 */
const applyMigrations = () => {
    const addColumn = (table, column, type) => {
        const info = db.prepare(`PRAGMA table_info(${table})`).all();
        if (!info.some(c => c.name === column)) {
            console.log(`[MIGRATION] Adding column ${column} to ${table}`);
            db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
        }
    };

    // Ensure all tables have required columns from UI updates
    addColumn('users', 'username', 'TEXT');
    addColumn('users', 'status', "TEXT DEFAULT 'active'");
    addColumn('users', 'avatar_url', 'TEXT');
    addColumn('events', 'image_url', 'TEXT');
    addColumn('events', 'featured', 'INTEGER DEFAULT 0');
    addColumn('registrations', 'checked_in_at', 'DATETIME');
    
    console.log('[SYSTEM] Migration check complete.');
};

/**
 * ══════════════════════════════════════════
 * SYSTEM SEEDING (FORCED RECOVERY)
 * ══════════════════════════════════════════
 */
const seedData = async () => {
    // 1. Force Admin Node to be Active
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@eventhub.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

    if (existingUser) {
        // If user exists but is deactivated, force reactivation
        db.prepare("UPDATE users SET role = 'admin', status = 'active' WHERE id = ?")
          .run(existingUser.id);
        console.log(`[SYSTEM] Admin node synchronized and re-activated: ${adminEmail}`);
    } else {
        const hash = await bcrypt.hash(adminPass, 12);
        db.prepare(`
            INSERT INTO users (email, password_hash, role, name, status) 
            VALUES (?, ?, 'admin', 'System Administrator', 'active')
        `).run(adminEmail, hash);
        console.log(`[SYSTEM] New admin node deployed: ${adminEmail}`);
    }

    // 2. Default Categories
    const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
    if (catCount === 0) {
        const categories = [
            ['Technology', 'Innovation and future tech summits', 'laptop', '#06b6d4'],
            ['Nightlife', 'Concerts, parties, and club events', 'music', '#a855f7'],
            ['Business', 'Conferences and networking sessions', 'briefcase', '#3b82f6'],
            ['Arts', 'Exhibitions and creative workshops', 'palette', '#ec4899']
        ];
        const stmt = db.prepare('INSERT INTO categories (name, description, icon, color) VALUES (?, ?, ?, ?)');
        categories.forEach(c => stmt.run(...c));
        console.log('[SYSTEM] Taxonomy categories seeded.');
    }
};

/**
 * ══════════════════════════════════════════
 * EXECUTION
 * ══════════════════════════════════════════
 */
try {
    initializeSchema();
    applyMigrations();
    seedData();
    console.log('✅ DATABASE OPERATIONAL');
} catch (err) {
    console.error('❌ CRITICAL SYSTEM FAILURE:', err.message);
    process.exit(1);
}

export default db;