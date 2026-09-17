'use client'

import { signOut } from 'next-auth/react'
import { PiSignOut } from 'react-icons/pi'
import type { Session } from 'next-auth'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function DashboardHeader({ session }: { session: Session }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-dark/10 px-4 sm:px-6 lg:px-8 py-4 relative z-40">
      <div className="flex items-center justify-between">
        <div className="lg:hidden w-11" />
        <div className="hidden lg:block">
          <h1 className="text-lg font-serif font-semibold text-dark">
            {getGreeting()}, {session.user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-sm text-dark/50">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-lime rounded-full flex items-center justify-center text-dark font-bold text-sm">
              {session.user?.name?.[0] || 'A'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-dark">
                {session.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-dark/50">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/mission-control/login' })}
            className="w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center hover:bg-dark/10 transition-colors"
            title="Sign out"
          >
            <PiSignOut className="w-5 h-5 text-dark/60" />
          </button>
        </div>
      </div>
    </header>
  )
}
