/**
 * Shared database connection helper for the scripts in this folder.
 *
 * Credentials are read from the DATABASE_URL environment variable. When it is
 * not set, a local Postgres instance is assumed. Never hardcode credentials
 * here or in the scripts that use this helper.
 *
 * Usage:
 *   import { createClient } from './db.mjs'
 *   const client = createClient()
 */
import pg from 'pg'

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:1234567890@localhost:5432/rescue_mission'

const needsSsl =
  connectionString.includes('neon.tech') || connectionString.includes('sslmode=require')

export function createClient() {
  return new pg.Client({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  })
}
