import { NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json({}, { status: 200 })
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json()
    await saveSettings(settings)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
