import { NextResponse } from 'next/server'
import { readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { getSettings, updateSettings } from '@/lib/settings'

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized
  return NextResponse.json((await getSettings()).programs?.items ?? [])
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  if (!body || !title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const program = await updateSettings((settings) => {
    const items = settings.programs?.items ?? []
    const beneficiaries = String(body.beneficiaries ?? '0')
    const item = {
      id: crypto.randomUUID(),
      title,
      subtitle: String(body.subtitle ?? ''),
      icon: String(body.icon ?? 'heart'),
      description: String(body.description ?? ''),
      status: String(body.status ?? 'active'),
      beneficiaries,
      features: [],
      impact: { beneficiaries },
      image: '',
    }
    settings.programs = { ...settings.programs, items: [...items, item] }
    return item
  })
  return NextResponse.json(program, { status: 201 })
}
