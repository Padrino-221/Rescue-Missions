import { Pool } from 'pg'
import type { QueryResultRow } from 'pg'

// Keep a single pool across dev hot-reloads
const globalForDb = globalThis as unknown as { pgPool?: Pool }

export const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      'postgres://postgres:1234567890@localhost:5432/rescue_mission',
  })

if (process.env.NODE_ENV !== 'production') globalForDb.pgPool = pool

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(text, params)
  return result.rows
}

/** Convert camelCase keys to snake_case column names. */
export function camelToSnake(value: string): string {
  return value.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
}

/**
 * Build a safe UPDATE ... RETURNING * for a single row, using only the
 * whitelisted camelCase fields present in `fields`.
 */
export async function updateRow<T extends QueryResultRow = QueryResultRow>(
  table: string,
  id: number,
  fields: Record<string, unknown>,
  allowed: string[]
): Promise<T | null> {
  const entries = Object.entries(fields).filter(
    ([key]) => allowed.includes(key) && fields[key] !== undefined
  )
  if (entries.length === 0) return null

  const setClause = entries
    .map(([key], i) => `${camelToSnake(key)} = $${i + 1}`)
    .join(', ')
  const values = entries.map(([, value]) => value)
  const result = await pool.query<T>(
    `UPDATE ${table} SET ${setClause} WHERE id = $${entries.length + 1} RETURNING *`,
    [...values, id]
  )
  return result.rows[0] ?? null
}

/** Parse a JSON string body into an object, returning null when invalid. */
export async function readJson(
  request: Request
): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json()
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}
