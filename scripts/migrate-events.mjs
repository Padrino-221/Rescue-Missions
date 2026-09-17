/**
 * Non-destructive migration: create the `events` table and optionally seed it
 * from data/events.json (only when the table is empty).
 *
 * Usage:
 *   DATABASE_URL="postgres://..." node scripts/migrate-events.mjs
 *
 * The script never deletes or overwrites existing events.
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from './db.mjs'

const SCHEMA = `
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Community',
  status TEXT NOT NULL DEFAULT 'upcoming',
  image_url TEXT NOT NULL DEFAULT ''
);
`

async function main() {
  const client = createClient()
  await client.connect()

  await client.query(SCHEMA)
  console.log('events table ready.')

  const existing = await client.query('SELECT count(*)::int AS count FROM events')
  if (existing.rows[0].count === 0) {
    const seedPath = join(process.cwd(), 'data', 'events.json')
    if (existsSync(seedPath)) {
      const events = JSON.parse(readFileSync(seedPath, 'utf-8'))
      for (const e of events) {
        await client.query(
          `INSERT INTO events (title, description, date, time, location, category, status, image_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            e.title ?? '',
            e.description ?? '',
            e.date ?? '',
            e.time ?? '',
            e.location ?? '',
            e.category ?? 'Community',
            e.status ?? 'upcoming',
            e.imageUrl ?? e.image ?? '',
          ]
        )
      }
      console.log(`Seeded ${events.length} events from data/events.json`)
    } else {
      console.log('No data/events.json found, table left empty.')
    }
  } else {
    console.log(`events already has ${existing.rows[0].count} row(s); not seeding.`)
  }

  const final = await client.query('SELECT count(*)::int AS count FROM events')
  console.log('events count:', final.rows[0].count)

  await client.end()
  console.log('Done.')
}

main().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
