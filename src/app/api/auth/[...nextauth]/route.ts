import NextAuth from 'next-auth'
import { adminAuthConfigured, authOptions } from '@/lib/auth'

const handler = adminAuthConfigured
  ? NextAuth(authOptions)
  : () => Response.json({ error: 'Admin authentication is not configured' }, { status: 503 })
export { handler as GET, handler as POST }
