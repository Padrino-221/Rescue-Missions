import { NextResponse } from 'next/server'
import { query, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const rows = await query(
    `SELECT id, type, category, title, image FROM gallery_items ORDER BY id DESC`
  )
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const title = String(body.title ?? '')
  const image = String(body.image ?? '')
  if (!title || !image) {
    return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })
  }

  const rows = await query(
    `INSERT INTO gallery_items (type, category, title, image)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [
      String(body.type ?? 'image'),
      String(body.category ?? 'Events'),
      title,
      image,
    ]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
