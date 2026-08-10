import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/settings'

export async function GET() {
  return NextResponse.json(getSettings())
}

export async function PUT(request: Request) {
  const settings = await request.json()
  saveSettings(settings)
  return NextResponse.json({ success: true })
}
