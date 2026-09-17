import { NextResponse } from 'next/server'
import { query, updateRow, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { ensureEventsTable } from '@/lib/events'

const EVENT_COLUMNS = `id, title, description, date, time, location, category, status,
  image_url AS "imageUrl"`

const EDIT_FIELDS = [
  'title',
  'description',
  'date',
  'time',
  'location',
  'category',
  'status',
  'imageUrl',
]

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const id = Number((await params).id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    await ensureEventsTable()
    const rows = await query(
      `SELECT ${EVENT_COLUMNS} FROM events WHERE id = $1`,
      [id]
    )
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('GET /api/events/[id] error:', error)
    return NextResponse.json({ error: 'Failed to load event' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const id = Number((await params).id)
  const body = await readJson(request)
  if (!body || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    await ensureEventsTable()
    const row = await updateRow('events', id, body, EDIT_FIELDS)
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const rows = await query(`SELECT ${EVENT_COLUMNS} FROM events WHERE id = $1`, [id])
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('PATCH /api/events/[id] error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const id = Number((await params).id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  try {
    await ensureEventsTable()
    const rows = await query('DELETE FROM events WHERE id = $1 RETURNING id', [id])
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/events/[id] error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
