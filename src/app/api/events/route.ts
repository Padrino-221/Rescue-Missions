import { NextResponse } from 'next/server'
import { query, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { ensureEventsTable } from '@/lib/events'

const EVENT_COLUMNS = `id, title, description, date, time, location, category, status,
  image_url AS "imageUrl"`

export async function GET() {
  try {
    await ensureEventsTable()
    const rows = await query(`SELECT ${EVENT_COLUMNS} FROM events ORDER BY id DESC`)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const title = String(body.title ?? '')
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  try {
    await ensureEventsTable()
    const rows = await query(
      `INSERT INTO events (title, description, date, time, location, category, status, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING ${EVENT_COLUMNS}`,
      [
        title,
        String(body.description ?? ''),
        String(body.date ?? ''),
        String(body.time ?? ''),
        String(body.location ?? ''),
        String(body.category ?? 'Community'),
        String(body.status ?? 'upcoming'),
        String(body.imageUrl ?? ''),
      ]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error('POST /api/events error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
