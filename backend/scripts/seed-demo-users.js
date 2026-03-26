#!/usr/bin/env node
import bcrypt from 'bcryptjs'
import db from '../src/config/db.js'

async function seed() {
  const users = [
    // Admin uses a plus-address alias and a password with a special character
    { email: 'admin+admin@eventhub.com', password: 'admin123!', role: 'admin', name: 'Demo Admin' },
    { email: 'organizer@eventhub.com', password: 'organizer123', role: 'organizer', name: 'Demo Organizer' },
    { email: 'attendee@eventhub.com', password: 'attendee123', role: 'attendee', name: 'Demo Attendee' }
  ]

  for (const u of users) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(u.email)
    const hash = bcrypt.hashSync(u.password, 12)
    if (existing) {
      db.prepare('UPDATE users SET password_hash = ?, role = ?, name = ?, status = ? WHERE email = ?')
        .run(hash, u.role, u.name, 'active', u.email)
      console.log(`Updated user: ${u.email}`)
    } else {
      db.prepare('INSERT INTO users (email, password_hash, role, name, status) VALUES (?, ?, ?, ?, ?)')
        .run(u.email, hash, u.role, u.name, 'active')
      console.log(`Created user: ${u.email}`)
    }
  }

  console.log('Demo users seeded.')
}

seed().catch((e) => {
  console.error('Seeding failed:', e)
  process.exit(1)
})
