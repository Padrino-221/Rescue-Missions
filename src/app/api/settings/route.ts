import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/settings'

export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const settings = await request.json()
  await saveSettings(settings)
  return NextResponse.json({ success: true })
}
