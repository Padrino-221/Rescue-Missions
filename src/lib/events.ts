import { query } from './db'

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

let ready: Promise<void> | null = null

/**
 * Ensures the `events` table exists. Safe to call on every request; the DDL is
 * only executed once per process. This keeps event creation working on
 * environments where the migration script hasn't been run.
 */
export function ensureEventsTable(): Promise<void> {
  if (!ready) {
    ready = query(SCHEMA).then(
      () => undefined,
      (err) => {
        ready = null
        throw err
      }
    )
  }
  return ready
}
