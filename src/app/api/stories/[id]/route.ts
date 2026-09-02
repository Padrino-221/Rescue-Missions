import { NextResponse } from 'next/server'
import { query, updateRow, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

const EDIT_FIELDS = [
  'title',
  'excerpt',
  'category',
  'author',
  'date',
  'readTime',
  'featured',
  'image',
  'content',
]

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const id = Number((await params).id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const rows = await query(
    `SELECT id, title, excerpt, category, author, date, read_time AS "readTime",
            featured, image, content
     FROM stories WHERE id = $1`,
    [id]
  )
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const id = Number((await params).id)
  const body = await readJson(request)
  if (!body || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const row = await updateRow('stories', id, body, EDIT_FIELDS)
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const id = Number((await params).id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { query } = await import('@/lib/db')
  const rows = await query('DELETE FROM stories WHERE id = $1 RETURNING id', [id])
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
