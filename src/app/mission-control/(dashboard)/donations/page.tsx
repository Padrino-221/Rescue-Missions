'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PiMagnifyingGlass,
  PiCurrencyCircleDollar,
  PiArrowUpRight,
  PiArrowDownRight,
  PiCalendar,
  PiExport,
} from 'react-icons/pi'

type Donation = {
  id: string
  donorName: string
  email: string
  amount: number
  type: 'One-time' | 'Monthly' | 'Sponsorship'
  date: string
  status: 'Completed' | 'Pending' | 'Failed'
}

const donations: Donation[] = [
  { id: 'DN-001', donorName: 'Kwame Mensah', email: 'kwame.mensah@gmail.com', amount: 2500, type: 'One-time', date: '2026-08-01', status: 'Completed' },
  { id: 'DN-002', donorName: 'Ama Osei', email: 'ama.osei@yahoo.com', amount: 1500, type: 'Monthly', date: '2026-08-02', status: 'Completed' },
  { id: 'DN-003', donorName: 'Kofi Asante', email: 'kofi.asante@outlook.com', amount: 5000, type: 'Sponsorship', date: '2026-08-03', status: 'Pending' },
  { id: 'DN-004', donorName: 'Abena Boateng', email: 'abena.boateng@gmail.com', amount: 500, type: 'One-time', date: '2026-08-04', status: 'Completed' },
  { id: 'DN-005', donorName: 'Kwadwo Appiah', email: 'kwadwo.appiah@gmail.com', amount: 750, type: 'Monthly', date: '2026-08-05', status: 'Failed' },
  { id: 'DN-006', donorName: 'Akosua Frimpong', email: 'akosua.frimpong@yahoo.com', amount: 3000, type: 'Sponsorship', date: '2026-08-06', status: 'Completed' },
  { id: 'DN-007', donorName: 'Yaw Boateng', email: 'yaw.boateng@gmail.com', amount: 200, type: 'One-time', date: '2026-08-07', status: 'Pending' },
  { id: 'DN-008', donorName: 'Efua Mensah', email: 'efua.mensah@outlook.com', amount: 1800, type: 'Monthly', date: '2026-08-07', status: 'Completed' },
  { id: 'DN-009', donorName: 'Kojo Adjei', email: 'kojo.adjei@gmail.com', amount: 1200, type: 'One-time', date: '2026-08-08', status: 'Failed' },
  { id: 'DN-010', donorName: 'Ama Serwaa', email: 'ama.serwaa@yahoo.com', amount: 4500, type: 'Sponsorship', date: '2026-08-08', status: 'Completed' },
  { id: 'DN-011', donorName: 'Nana Osei-Bonsu', email: 'nana.oseibonsu@gmail.com', amount: 800, type: 'One-time', date: '2026-08-09', status: 'Pending' },
  { id: 'DN-012', donorName: 'Adwoa Korankye', email: 'adwoa.korankye@outlook.com', amount: 2200, type: 'Monthly', date: '2026-08-09', status: 'Completed' },
  { id: 'DN-013', donorName: 'Kwesi Amoako', email: 'kwesi.amoako@gmail.com', amount: 50, type: 'One-time', date: '2026-08-09', status: 'Completed' },
  { id: 'DN-014', donorName: 'Esi Ackah', email: 'esi.ackah@yahoo.com', amount: 3500, type: 'Sponsorship', date: '2026-08-10', status: 'Pending' },
  { id: 'DN-015', donorName: 'Kofi Mensah', email: 'kofi.mensah@gmail.com', amount: 950, type: 'One-time', date: '2026-08-10', status: 'Completed' },
]

const statusStyles: Record<string, string> = {
  Completed: 'bg-lime/10 text-dark',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
}

const typeStyles: Record<string, string> = {
  'One-time': 'bg-dark/5 text-dark',
  Monthly: 'bg-purple-100 text-purple-700',
  Sponsorship: 'bg-blue-100 text-blue-700',
}

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')

  const filtered = donations.filter((d) => {
    const matchSearch =
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter =
      activeFilter === 'all' ||
      d.status.toLowerCase() === activeFilter
    return matchSearch && matchFilter
  })

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0)
  const completedCount = donations.filter((d) => d.status === 'Completed').length
  const completedAmount = donations.filter((d) => d.status === 'Completed').reduce((s, d) => s + d.amount, 0)
  const pendingCount = donations.filter((d) => d.status === 'Pending').length
  const pendingAmount = donations.filter((d) => d.status === 'Pending').reduce((s, d) => s + d.amount, 0)
  const failedCount = donations.filter((d) => d.status === 'Failed').length
  const failedAmount = donations.filter((d) => d.status === 'Failed').reduce((s, d) => s + d.amount, 0)

  const summaryCards = [
    { label: 'Total Raised', count: donations.length, amount: totalRaised, icon: PiCurrencyCircleDollar, color: 'bg-dark' },
    { label: 'Completed', count: completedCount, amount: completedAmount, icon: PiArrowUpRight, color: 'bg-lime' },
    { label: 'Pending', count: pendingCount, amount: pendingAmount, icon: PiCalendar, color: 'bg-yellow-500' },
    { label: 'Failed', count: failedCount, amount: failedAmount, icon: PiArrowDownRight, color: 'bg-red-500' },
  ]

  const formatCurrency = (val: number) => `GH₵${val.toLocaleString()}`

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-dark">Donations</h1>
            <p className="mt-1 text-dark/60">Manage and track all donations</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark/90">
            <PiExport className="text-lg" />
            Export
          </button>
        </motion.div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="rounded-2xl border border-dark/10 bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-dark/60">{card.label}</span>
                <div className={`${card.color} rounded-full p-2`}>
                  <card.icon className="text-lg text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-dark">{card.count}</p>
              <p className="text-sm text-dark/50">{formatCurrency(card.amount)}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-4 flex flex-wrap gap-2"
        >
          {(['all', 'completed', 'pending', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeFilter === f
                  ? 'bg-dark text-white'
                  : 'bg-white text-dark/60 border border-dark/10 hover:bg-dark/5'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <PiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 text-lg" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-dark/10 bg-white py-2.5 pl-10 pr-4 text-sm text-dark placeholder:text-dark/40 focus:border-dark/30 focus:outline-none focus:ring-2 focus:ring-dark/10"
            />
          </div>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="hidden overflow-hidden rounded-2xl border border-dark/10 bg-white md:block"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark/10 bg-cream/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark/50">Donor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark/50">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark/50">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark/50">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark/50">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-dark/50">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-dark/50">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-dark/40">
                    No donations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="border-b border-dark/5 transition-colors hover:bg-cream/30"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-dark">{d.donorName}</p>
                      <p className="text-xs text-dark/40">{d.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark/60">{d.email}</td>
                    <td className="px-6 py-4 text-sm font-bold text-dark">{formatCurrency(d.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${typeStyles[d.type]}`}>
                        {d.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark/60">{d.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[d.status]}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg bg-dark/5 px-3 py-1.5 text-xs font-medium text-dark transition-colors hover:bg-dark hover:text-white">
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dark/10 bg-white p-8 text-center text-sm text-dark/40">
              No donations found matching your criteria.
            </div>
          ) : (
            filtered.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="rounded-2xl border border-dark/10 bg-white p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-dark">{d.donorName}</p>
                    <p className="text-xs text-dark/50">{d.email}</p>
                  </div>
                  <p className="text-lg font-bold text-dark">{formatCurrency(d.amount)}</p>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${typeStyles[d.type]}`}>
                    {d.type}
                  </span>
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[d.status]}`}>
                    {d.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-dark/40">{d.date}</p>
                  <button className="rounded-lg bg-dark/5 px-3 py-1.5 text-xs font-medium text-dark transition-colors hover:bg-dark hover:text-white">
                    View
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}