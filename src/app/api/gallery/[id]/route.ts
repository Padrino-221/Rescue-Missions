import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { updateSettings } from '@/lib/settings'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const id = Number((await params).id)
  if (!Number.isSafeInteger(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const removed = await updateSettings((settings) => {
    const items = settings.gallery?.items ?? []
    const remaining = items.filter((item) => Number(item.id) !== id)
    if (items.length === remaining.length) return false
    settings.gallery.items = remaining
    return true
  })
  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
