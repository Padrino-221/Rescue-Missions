'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  PiHeartFill,
  PiNewspaper,
  PiImages,
  PiBooks,
  PiChatsCircle,
  PiCurrencyCircleDollar,
  PiTrendUp,
  PiUsers
} from 'react-icons/pi'

const stats = [
  {
    label: 'Total Donations',
    value: 'GH₵2.5M',
    change: '+12.5%',
    icon: PiCurrencyCircleDollar,
    bgColor: 'bg-lime/10'
  },
  {
    label: 'Children Supported',
    value: '5,247',
    change: '+8.2%',
    icon: PiHeartFill,
    bgColor: 'bg-red-50'
  },
  {
    label: 'Active Volunteers',
    value: '186',
    change: '+15.3%',
    icon: PiUsers,
    bgColor: 'bg-blue-50'
  },
  {
    label: 'Published Stories',
    value: '24',
    change: '+4 this month',
    icon: PiNewspaper,
    bgColor: 'bg-purple-50'
  }
]

const quickActions = [
  { label: 'Manage Stories', icon: PiNewspaper, href: '/mission-control/stories', color: 'bg-lime' },
  { label: 'Photo Gallery', icon: PiImages, href: '/mission-control/gallery', color: 'bg-dark' },
  { label: 'Programs', icon: PiBooks, href: '/mission-control/programs', color: 'bg-amber-500' },
  { label: 'Contacts', icon: PiChatsCircle, href: '/mission-control/contacts', color: 'bg-blue-500' },
  { label: 'Donations', icon: PiCurrencyCircleDollar, href: '/mission-control/donations', color: 'bg-green-600' }
]

const recentActivity = [
  { id: 1, type: 'donation', message: 'New donation of GH₵500 received from John Mensah', time: '2 minutes ago', icon: PiCurrencyCircleDollar },
  { id: 2, type: 'story', message: 'New story "Hope for Tomorrow" was published', time: '15 minutes ago', icon: PiNewspaper },
  { id: 3, type: 'contact', message: 'New contact inquiry from Sunshine Foundation', time: '1 hour ago', icon: PiChatsCircle },
  { id: 4, type: 'gallery', message: '5 new photos uploaded to the gallery', time: '2 hours ago', icon: PiImages },
  { id: 5, type: 'volunteer', message: 'Sarah Asante signed up as a volunteer', time: '3 hours ago', icon: PiUsers }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function MissionControlOverview() {
  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-dark">Overview</h1>
        <p className="font-body text-dark/60 mt-1">Welcome back to Mission Control</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => {
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
                  <p className="font-serif text-2xl md:text-3xl font-bold text-dark mt-1">{stat.value}</p>
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
          <h2 className="font-serif text-xl font-bold text-dark mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-dark/5 transition-colors">
                  <div className="bg-dark/10 p-2 rounded-lg mt-0.5">
                    <Icon className="text-sm text-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-dark text-sm leading-relaxed">{activity.message}</p>
                    <p className="font-body text-xs text-dark/50 mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
