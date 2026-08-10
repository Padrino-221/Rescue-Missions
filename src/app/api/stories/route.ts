import { NextResponse } from 'next/server'
import { query, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

const CREATE_FIELDS = [
  'title',
  'excerpt',
  'category',
  'author',
  'date',
  'readTime',
  'featured',
  'image',
  'content',
] as const

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const rows = await query(
    `SELECT id, title, excerpt, category, author, date, read_time AS "readTime",
            featured, image, content
     FROM stories ORDER BY id DESC`
  )
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const values = CREATE_FIELDS.map((f) =>
    f === 'featured' ? Boolean(body[f]) : (body[f] ?? '')
  )
  const rows = await query(
    `INSERT INTO stories (title, excerpt, category, author, date, read_time, featured, image, content)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, title, excerpt, category, author, date, read_time AS "readTime", featured, image, content`,
    values
  )
  return NextResponse.json(rows[0], { status: 201 })
}
