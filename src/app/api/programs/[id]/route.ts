import { NextResponse } from 'next/server'
import { query, updateRow, readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const id = Number((await params).id)
  const body = await readJson(request)
  if (!body || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const row = await updateRow('programs', id, body, [
    'title',
    'subtitle',
    'icon',
    'description',
    'status',
    'beneficiaries',
  ])
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(row)
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const id = Number((await params).id)
  if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const rows = await query('DELETE FROM programs WHERE id = $1 RETURNING id', [id])
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
