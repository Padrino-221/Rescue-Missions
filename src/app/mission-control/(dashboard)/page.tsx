'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  PiHeartFill,
  PiNewspaper,
  PiImages,
  PiBooks,
  PiChatsCircle,
  PiTrendUp,
  PiUsers,
  PiSpinner,
} from 'react-icons/pi'

type Stats = {
  unreadContacts: number
  totalContacts: number
  publishedStories: number
  totalStories: number
  activePrograms: number
  totalPrograms: number
  galleryItems: number
}

type Activity = { id: string; type: string; message: string }

const activityIcons: Record<string, typeof PiNewspaper> = {
  story: PiNewspaper,
  contact: PiChatsCircle,
  gallery: PiImages,
  volunteer: PiUsers,
}

const quickActions = [
  { label: 'Manage Stories', icon: PiNewspaper, href: '/mission-control/stories', color: 'bg-lime' },
  { label: 'Photo Gallery', icon: PiImages, href: '/mission-control/gallery', color: 'bg-dark' },
  { label: 'Programs', icon: PiBooks, href: '/mission-control/programs', color: 'bg-amber-500' },
  { label: 'Contacts', icon: PiChatsCircle, href: '/mission-control/contacts', color: 'bg-blue-500' },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function MissionControlOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load stats')
        return res.json()
      })
      .then((data) => {
        setStats(data.stats)
        setActivity(data.activity ?? [])
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats
    ? [
        {
          label: 'Active Programs',
          value: String(stats.activePrograms),
          change: `${stats.totalPrograms} total programs`,
          icon: PiBooks,
          bgColor: 'bg-red-50',
        },
        {
          label: 'Published Stories',
          value: String(stats.publishedStories),
          change: `${stats.totalStories} total stories`,
          icon: PiNewspaper,
          bgColor: 'bg-purple-50',
        },
        {
          label: 'Unread Messages',
          value: String(stats.unreadContacts),
          change: `${stats.totalContacts} total contacts`,
          icon: PiChatsCircle,
          bgColor: 'bg-blue-50',
        },
      ]
    : []

  return (
    <div className="min-h-screen bg-cream p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-dark">Overview</h1>
        <p className="font-body text-dark/60 mt-1">Welcome back to Mission Control</p>
      </motion.div>

      {loading ? (
        <div className="rounded-2xl border border-dark/10 bg-white p-16 text-center">
          <PiSpinner className="mx-auto animate-spin text-3xl text-dark/30" />
        </div>
      ) : stats ? (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  variants={item}
                  className="bg-white rounded-2xl border border-dark/10 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-body text-sm text-dark/60">{stat.label}</p>
                      <p className="font-serif text-2xl md:text-3xl font-bold text-dark mt-1">
                        {stat.value}
                      </p>
                      <p className="font-body text-xs text-lime font-semibold mt-2 flex items-center gap-1">
                        <PiTrendUp className="text-sm" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                      <Icon className="text-xl text-dark" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-1 bg-white rounded-2xl border border-dark/10 p-6"
            >
              <h2 className="font-serif text-xl font-bold text-dark mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark/5 transition-colors group"
                    >
                      <div className={`${action.color} p-2 rounded-lg text-white group-hover:scale-105 transition-transform`}>
                        <Icon className="text-lg" />
                      </div>
                      <span className="font-body font-semibold text-dark group-hover:text-dark/80">{action.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:col-span-2 bg-white rounded-2xl border border-dark/10 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-dark">Recent Activity</h2>
                <div className="flex gap-2">
                  <Link
                    href="/mission-control/contacts"
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                      stats.unreadContacts > 0
                        ? 'bg-coral/10 text-coral hover:bg-coral/20'
                        : 'bg-dark/5 text-dark/50'
                    }`}
                  >
                    {stats.unreadContacts} unread messages
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                {activity.length === 0 && (
                  <p className="text-dark/40 text-sm">No recent activity yet.</p>
                )}
                {activity.map((a) => {
                  const Icon = activityIcons[a.type] ?? PiHeartFill
                  return (
                    <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-dark/5 transition-colors">
                      <div className="bg-dark/10 p-2 rounded-lg mt-0.5">
                        <Icon className="text-sm text-dark" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-dark text-sm leading-relaxed">{a.message}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-600">
            Could not load dashboard stats. Check that the database is running and seeded.
          </p>
        </div>
      )}
    </div>
  )
}
