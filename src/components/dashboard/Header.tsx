'use client'

import { signOut } from 'next-auth/react'
import { PiSignOut, PiBell } from 'react-icons/pi'
import type { Session } from 'next-auth'

export default function DashboardHeader({ session }: { session: Session }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-dark/10 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="lg:hidden w-11" />
        <div className="hidden lg:block" />
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center hover:bg-dark/10 transition-colors">
            <PiBell className="w-5 h-5 text-dark/60" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral rounded-full text-[10px] font-bold text-white flex items-center justify-center">
              3
            </span>
          </button>
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
