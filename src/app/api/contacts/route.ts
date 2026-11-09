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
  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!name || name.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !message || message.length > 5000 || subject.length > 150) {
    return NextResponse.json({ error: 'Enter a name, valid email address, and message of up to 5,000 characters.' }, { status: 400 })
  }

  const rows = await query(
    `INSERT INTO contacts (name, email, subject, message, date, read)
     VALUES ($1,$2,$3,$4,$5,FALSE) RETURNING id`,
    [name, email, subject, message, new Date().toISOString().slice(0, 10)]
  )
  return NextResponse.json({ id: rows[0].id }, { status: 201 })
}
