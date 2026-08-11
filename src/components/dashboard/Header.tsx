'use client'

import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { PiSignOut, PiBell, PiCheck, PiX } from 'react-icons/pi'
import type { Session } from 'next-auth'

const defaultNotifications = [
  { id: 1, text: 'New story "Hope for the Future" published', time: '1 hour ago', read: false },
  { id: 2, text: 'Contact form submitted by Partnership Ltd', time: '3 hours ago', read: false },
  { id: 3, text: '5 new photos uploaded to gallery', time: '1 day ago', read: true },
  { id: 4, text: 'New volunteer signup: Ama Osei', time: '2 days ago', read: true },
]

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
  const [notifications, setNotifications] = useState(defaultNotifications)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: number) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function dismissNotification(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-dark/10 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="lg:hidden w-11" />
        <div className="hidden lg:block">
          <h1 className="text-lg font-serif font-semibold text-dark">
            {getGreeting()}, {session.user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-sm text-dark/50">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="relative w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center hover:bg-dark/10 transition-colors"
            >
              <PiBell className="w-5 h-5 text-dark/60" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-white rounded-2xl border border-dark/10 shadow-xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dark/10">
                  <h3 className="font-semibold text-dark text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-dark/50 hover:text-dark flex items-center gap-1"
                    >
                      <PiCheck className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-dark/40 text-sm">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-dark/5 last:border-0 hover:bg-cream/50 transition-colors ${
                          !n.read ? 'bg-lime/5' : ''
                        }`}
                      >
                        {!n.read && (
                          <span className="mt-1.5 w-2 h-2 bg-lime rounded-full flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm leading-snug ${!n.read ? 'text-dark font-medium' : 'text-dark/60'}`}>
                            {n.text}
                          </p>
                          <p className="text-[10px] sm:text-xs text-dark/40 mt-0.5">{n.time}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!n.read && (
                            <button
                              onClick={() => markRead(n.id)}
                              className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-dark/10 transition-colors"
                              title="Mark as read"
                            >
                              <PiCheck className="w-3 h-3 text-dark/40" />
                            </button>
                          )}
                          <button
                            onClick={() => dismissNotification(n.id)}
                            className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-dark/10 transition-colors"
                            title="Dismiss"
                          >
                            <PiX className="w-3 h-3 text-dark/40" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
