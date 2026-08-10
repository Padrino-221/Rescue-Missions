import { NextResponse } from 'next/server'
import { query, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const rows = await query(
    `SELECT id, donor_name AS "donorName", email, amount::float AS amount, type, date, status
     FROM donations ORDER BY date DESC, id DESC`
  )
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const donorName = String(body.donorName ?? '')
  const email = String(body.email ?? '')
  const amount = Number(body.amount)
  if (!donorName || !email || Number.isNaN(amount)) {
    return NextResponse.json({ error: 'Donor name, email and amount are required' }, { status: 400 })
  }

  const rows = await query(
    `INSERT INTO donations (donor_name, email, amount, type, date, status)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, donor_name AS "donorName", email, amount::float AS amount, type, date, status`,
    [
      donorName,
      email,
      amount,
      String(body.type ?? 'One-time'),
      String(body.date ?? new Date().toISOString().slice(0, 10)),
      String(body.status ?? 'Pending'),
    ]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
