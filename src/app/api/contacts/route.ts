import { NextResponse } from 'next/server'
import { query, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const rows = await query(
    `SELECT id, name, email, subject, message, date, read
     FROM contacts ORDER BY date DESC, id DESC`
  )
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const name = String(body.name ?? '')
  const email = String(body.email ?? '')
  const subject = String(body.subject ?? '')
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const rows = await query(
    `INSERT INTO contacts (name, email, subject, message, date, read)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      name,
      email,
      subject,
      String(body.message ?? ''),
      String(body.date ?? new Date().toISOString().slice(0, 10)),
      Boolean(body.read),
    ]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
