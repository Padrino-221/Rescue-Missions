import { NextResponse } from 'next/server'
import { query, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const rows = await query(
    `SELECT id, title, subtitle, icon, description, status, beneficiaries
     FROM programs ORDER BY id ASC`
  )
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const title = String(body.title ?? '')
  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const rows = await query(
    `INSERT INTO programs (title, subtitle, icon, description, status, beneficiaries)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [
      title,
      String(body.subtitle ?? ''),
      String(body.icon ?? 'heart'),
      String(body.description ?? ''),
      String(body.status ?? 'active'),
      String(body.beneficiaries ?? '0'),
    ]
  )
  return NextResponse.json(rows[0], { status: 201 })
}
