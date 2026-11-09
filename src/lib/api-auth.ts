import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

/**
 * Guards an API route with the admin session. Returns an unauthorized
 * NextResponse when there is no session, or null when the request is allowed.
 */
export async function requireAuth(): Promise<NextResponse | null> {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
