import { NextResponse } from 'next/server'
import { readJson } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'
import { getSettings, updateSettings } from '@/lib/settings'
import { isOptionalYouTubeUrl, youtubeId } from '@/lib/youtube'

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized
  return NextResponse.json((await getSettings()).gallery?.items ?? [])
}

export async function POST(request: Request) {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const body = await readJson(request)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const title = String(body.title ?? '').trim()
  const image = String(body.image ?? '').trim()
  const videoUrl = body.videoUrl ?? ''
  if (!isOptionalYouTubeUrl(videoUrl)) {
    return NextResponse.json({ error: 'Enter a valid YouTube video URL' }, { status: 400 })
  }
  if (!title || (!image && !youtubeId(videoUrl))) {
    return NextResponse.json({ error: 'Title and image or video are required' }, { status: 400 })
  }

  const item = await updateSettings((settings) => {
    const items = settings.gallery?.items ?? []
    const id = items.reduce((next, entry) => Math.max(next, Number(entry.id) + 1), Date.now())
    const entry = {
      id,
      type: String(body.type ?? (youtubeId(videoUrl) ? 'video' : 'image')),
      category: String(body.category ?? 'Events'),
      title,
      image,
      alt: String(body.alt ?? title),
      videoUrl: String(videoUrl).trim(),
    }
    settings.gallery = { ...settings.gallery, items: [entry, ...items] }
    return entry
  })
  return NextResponse.json(item, { status: 201 })
}
