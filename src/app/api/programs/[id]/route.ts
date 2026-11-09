import { NextResponse } from 'next/server'
import { readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { updateSettings } from '@/lib/settings'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const { id } = await params
  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const changes = Object.fromEntries(
    Object.entries(body).filter(([key, value]) =>
      ['title', 'subtitle', 'icon', 'description', 'status', 'beneficiaries'].includes(key) &&
      typeof value === 'string'
    )
  )
  if (!Object.keys(changes).length || (typeof changes.title === 'string' && !changes.title.trim())) {
    return NextResponse.json({ error: 'Invalid program changes' }, { status: 400 })
  }

  const program = await updateSettings((settings) => {
    const item = settings.programs?.items?.find((entry) => String(entry.id) === id)
    if (!item) return null
    Object.assign(item, changes)
    if (typeof changes.beneficiaries === 'string') {
      item.impact = { ...item.impact, beneficiaries: changes.beneficiaries }
    }
    return item
  })
  if (!program) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(program)
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const { id } = await params
  const removed = await updateSettings((settings) => {
    const items = settings.programs?.items ?? []
    const remaining = items.filter((item) => String(item.id) !== id)
    if (items.length === remaining.length) return false
    settings.programs.items = remaining
    return true
  })
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
