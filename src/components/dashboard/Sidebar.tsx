'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PiHouseLine,
  PiNewspaper,
  PiImages,
  PiBooks,
  PiChatsCircle,
  PiCurrencyCircleDollar,
  PiList,
  PiX,
  PiHeartFill,
} from 'react-icons/pi'

const navItems = [
  { label: 'Overview', href: '/mission-control', icon: PiHouseLine },
  { label: 'Stories', href: '/mission-control/stories', icon: PiNewspaper },
  { label: 'Gallery', href: '/mission-control/gallery', icon: PiImages },
  { label: 'Programs', href: '/mission-control/programs', icon: PiBooks },
  { label: 'Contacts', href: '/mission-control/contacts', icon: PiChatsCircle },
  { label: 'Donations', href: '/mission-control/donations', icon: PiCurrencyCircleDollar },
]

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/mission-control') return pathname === '/mission-control'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-11 h-11 bg-dark rounded-xl flex items-center justify-center text-white"
      >
        <PiList className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/50 z-50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-dark z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/mission-control" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime rounded-full flex items-center justify-center">
              <PiHeartFill className="w-5 h-5 text-dark" />
            </div>
            <div>
              <span className="text-white font-serif font-semibold text-sm block">
                Mission Control
              </span>
              <span className="text-white/40 text-xs">Admin Panel</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <PiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 mt-2">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-lime text-dark'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all"
          >
            View Public Site
          </Link>
        </div>
      </aside>
    </>
  )
}
