// src/config/db.js
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../ems.db');
console.log(`[DB] Initializing SQLite database at: ${dbPath}`);

let db;
try {
  db = new Database(dbPath, {
    verbose: console.log,  // Logs every SQL query – very useful during dev/debug
  });

  // Enable Write-Ahead Logging (critical for concurrency)
  const walResult = db.pragma('journal_mode = WAL', { simple: true });
  console.log(`[DB] journal_mode set to: ${walResult}`);

  // Verify it actually took effect
  const currentMode = db.pragma('journal_mode', { simple: true });
  console.log(`[DB] Current journal_mode (verified): ${currentMode}`);

  if (currentMode !== 'wal') {
    console.warn(
      `[DB] WARNING: WAL mode did NOT activate (got "${currentMode}"). ` +
      'This can cause blocking during writes. Delete ems.db and restart the server.'
    );
  }

  // Prevent indefinite blocking when DB is locked
  db.pragma('busy_timeout = 5000');  // 5 seconds max wait → then throw SQLITE_BUSY

  // Enforce foreign keys
  db.pragma('foreign_keys = ON');

  // Full schema – includes new tables for bookings, attendance, expectations
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'attendee' CHECK(role IN ('attendee', 'organizer', 'admin', 'superadmin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      total_capacity INTEGER NOT NULL,
      remaining_capacity INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      location TEXT,
      date DATETIME NOT NULL,
      version INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'past', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT DEFAULT '#3b82f6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY,
      event_id INTEGER NOT NULL REFERENCES events(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY,
      event_id INTEGER NOT NULL REFERENCES events(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      space_type TEXT NOT NULL CHECK(space_type IN ('seminar', 'vendor_booth', 'workshop', 'other')),
      booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled'))
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY,
      ticket_id INTEGER REFERENCES tickets(id),
      booking_id INTEGER REFERENCES bookings(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      event_id INTEGER NOT NULL REFERENCES events(id),
      scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(ticket_id, booking_id) -- prevent double scans
    );

    CREATE TABLE IF NOT EXISTS expectations (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      event_id INTEGER NOT NULL REFERENCES events(id),
      expectation_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      ticket_id INTEGER REFERENCES tickets(id),
      amount_cents INTEGER NOT NULL,
      status TEXT CHECK(status IN ('completed', 'failed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS refunds (
      id INTEGER PRIMARY KEY,
      transaction_id INTEGER NOT NULL REFERENCES transactions(id),
      created_by INTEGER NOT NULL REFERENCES users(id),
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY,
      event_id INTEGER NOT NULL REFERENCES events(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS idempotency_log (
      idempotency_key TEXT NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id),
      endpoint TEXT NOT NULL,
      response_status INTEGER NOT NULL,
      response_body TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      PRIMARY KEY (idempotency_key, user_id)
    );

    CREATE TABLE IF NOT EXISTS ledger (
      id INTEGER PRIMARY KEY,
      event_id INTEGER NOT NULL REFERENCES events(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      action TEXT NOT NULL,
      quantity_changed INTEGER NOT NULL,
      previous_capacity INTEGER NOT NULL,
      new_capacity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY,
      actor_user_id INTEGER REFERENCES users(id),
      action TEXT NOT NULL,
      target_type TEXT,
      target_id INTEGER,
      ip_address TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('[DB] All tables created/verified');

  // Add new user profile columns if they are missing (safe migration)
  const userColumns = db.prepare("PRAGMA table_info(users)").all().map((c) => c.name);
  if (!userColumns.includes('name')) {
    db.prepare('ALTER TABLE users ADD COLUMN name TEXT').run();
  }
  if (!userColumns.includes('phone')) {
    db.prepare('ALTER TABLE users ADD COLUMN phone TEXT').run();
  }
  if (!userColumns.includes('status')) {
    db.prepare("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'").run();
    db.prepare("UPDATE users SET status = 'active' WHERE status IS NULL").run();
  }
  if (!userColumns.includes('deleted_at')) {
    db.prepare('ALTER TABLE users ADD COLUMN deleted_at DATETIME').run();
  }
  if (!userColumns.includes('profession')) {
    db.prepare('ALTER TABLE users ADD COLUMN profession TEXT').run();
  }
  if (!userColumns.includes('profile_image_url')) {
    db.prepare('ALTER TABLE users ADD COLUMN profile_image_url TEXT').run();
  }

  // Migrate legacy 'user' role values (if any) to 'attendee' to match frontend conventions
  try {
    const legacyCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'user'").get().c;
    if (legacyCount > 0) {
      console.log(`[DB] Migrating ${legacyCount} legacy 'user' role(s) -> 'attendee'`);
      try {
        db.prepare("UPDATE users SET role = 'attendee' WHERE role = 'user'").run();
      } catch (e) {
        console.warn('[DB] Direct role update failed due to existing CHECK constraint. Rebuilding users table to apply new role set.');

        // Rebuild users table with new CHECK constraint and migrate data (map 'user' -> 'attendee')
        // Disable foreign keys to allow table rebuild
        db.pragma('foreign_keys = OFF');
        db.exec("BEGIN TRANSACTION;");
        db.exec(`
          CREATE TABLE IF NOT EXISTS users_new (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            phone TEXT,
            role TEXT NOT NULL DEFAULT 'attendee' CHECK(role IN ('attendee', 'organizer', 'admin', 'superadmin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active',
            deleted_at DATETIME
          );
        `);

        // Copy existing data, mapping legacy 'user' to 'attendee'
        db.prepare(`
          INSERT INTO users_new (id, email, password_hash, name, phone, role, created_at, status, deleted_at)
          SELECT id, email, password_hash, name, phone,
                 CASE WHEN role = 'user' THEN 'attendee' ELSE role END,
                 created_at,
                 COALESCE(status, 'active'),
                 deleted_at
          FROM users;
        `).run();
        // Replace old users table with the new one
        db.exec('DROP TABLE IF EXISTS users;');
        db.exec('ALTER TABLE users_new RENAME TO users;');
        db.exec('COMMIT;');
        // Re-enable foreign key enforcement
        db.pragma('foreign_keys = ON');
        console.log('[DB] users table rebuilt and roles migrated.');
      }
    }
  } catch (e) {
    console.warn('[DB] Role migration check failed:', e.message);
  }

  // Add missing event columns for admin controls
  const eventColumns = db.prepare("PRAGMA table_info(events)").all().map((c) => c.name);
  if (!eventColumns.includes('category_id')) {
    db.prepare('ALTER TABLE events ADD COLUMN category_id INTEGER').run();
  }
  if (!eventColumns.includes('featured')) {
    db.prepare('ALTER TABLE events ADD COLUMN featured INTEGER DEFAULT 0').run();
  }
  if (!eventColumns.includes('image_url')) {
    db.prepare('ALTER TABLE events ADD COLUMN image_url TEXT').run();
  }
  if (!eventColumns.includes('organizer_id')) {
    db.prepare('ALTER TABLE events ADD COLUMN organizer_id INTEGER').run();
  }
  if (!eventColumns.includes('deleted_at')) {
    db.prepare('ALTER TABLE events ADD COLUMN deleted_at DATETIME').run();
  }

  // Add missing payment metadata columns
  const transactionColumns = db.prepare("PRAGMA table_info(transactions)").all().map((c) => c.name);
  if (!transactionColumns.includes('method')) {
    db.prepare("ALTER TABLE transactions ADD COLUMN method TEXT DEFAULT 'card'").run();
  }
  if (!transactionColumns.includes('currency')) {
    db.prepare("ALTER TABLE transactions ADD COLUMN currency TEXT DEFAULT 'USD'").run();
  }
  if (!transactionColumns.includes('payment_details')) {
    db.prepare('ALTER TABLE transactions ADD COLUMN payment_details TEXT').run();
  }
  if (!transactionColumns.includes('updated_at')) {
    db.prepare('ALTER TABLE transactions ADD COLUMN updated_at DATETIME').run();
  }

  // Add missing review columns
  const reviewColumns = db.prepare("PRAGMA table_info(reviews)").all().map((c) => c.name);
  if (!reviewColumns.includes('deleted_at')) {
    db.prepare('ALTER TABLE reviews ADD COLUMN deleted_at DATETIME').run();
  }

  // Seed admin user if requested (safe: only if no admin exists)
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || 'Admin';
  const adminRoleEnv = (process.env.ADMIN_ROLE || 'admin').trim().toLowerCase();
  const adminRole = ['admin', 'superadmin'].includes(adminRoleEnv) ? adminRoleEnv : 'admin';

  if (adminEmail && adminPassword) {
    if (adminPassword.length < 8) {
      console.warn('[DB] Admin seed skipped: ADMIN_PASSWORD must be at least 8 characters.');
    } else {
      const existingAdmin = db
        .prepare("SELECT id FROM users WHERE role IN ('admin','superadmin') LIMIT 1")
        .get();
      if (!existingAdmin) {
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
        if (existingUser) {
          db.prepare("UPDATE users SET role = ?, status = 'active' WHERE id = ?").run(
            adminRole,
            existingUser.id
          );
          console.log(`[DB] Admin seed: promoted ${adminEmail} to ${adminRole}`);
        } else {
          const passwordHash = bcrypt.hashSync(adminPassword, 12);
          db.prepare(
            'INSERT INTO users (email, password_hash, role, name, status) VALUES (?, ?, ?, ?, ?)'
          ).run(adminEmail, passwordHash, adminRole, adminName, 'active');
          console.log(`[DB] Admin seed: created ${adminRole} ${adminEmail}`);
        }
      } else {
        console.log('[DB] Admin seed: admin already exists — skipping');
      }
    }
  } else {
    console.log('[DB] Admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD to auto-create an admin');
  }

  // Seed example events (only if table is empty)
  const eventCount = db.prepare('SELECT COUNT(*) as c FROM events').get().c;
  if (eventCount === 0) {
    db.prepare(`
      INSERT INTO events (name, description, total_capacity, remaining_capacity, price_cents, location, date, status) 
      VALUES 
        ('Taylor Swift World Tour 2026', 'Global pop concert tour', 85000, 85000, 24900, 'Multiple venues', '2026-06-01 19:00:00', 'active'),
        ('xAI Developer Summit', 'AI innovation conference', 5000, 5000, 49900, 'Austin, TX', '2025-12-10 09:00:00', 'active'),
        ('Crypto Carnival Lagos', 'Blockchain & crypto festival', 12000, 12000, 8900, 'Lagos, Nigeria', '2025-11-15 10:00:00', 'active')
    `).run();
    console.log('✅ Sample events seeded');
  } else {
    console.log(`[DB] ${eventCount} events already exist — skipping seed`);
  }

} catch (err) {
  console.error('[DB] Failed to initialize database:', err.message);
  console.error(err.stack);
  process.exit(1);  // Crash early in dev if DB fails
}

export default db;
