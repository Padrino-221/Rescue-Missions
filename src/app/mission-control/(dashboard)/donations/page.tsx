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
  PiPlus,
  PiSpinner,
} from 'react-icons/pi'
import { useResource } from '@/lib/useResource'
import Modal from '@/components/dashboard/Modal'
import Select from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import { useAlert } from '@/components/ui/Alert'

type Donation = {
  id: number
  donorName: string
  email: string
  amount: number
  type: 'One-time' | 'Monthly' | 'Sponsorship'
  date: string
  status: 'Completed' | 'Pending' | 'Failed'
}

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

type DonationForm = {
  donorName: string
  email: string
  amount: string
  type: Donation['type']
  status: Donation['status']
  date: string
}

const emptyForm: DonationForm = {
  donorName: '',
  email: '',
  amount: '',
  type: 'One-time',
  status: 'Pending',
  date: '',
}

const inputClasses =
  'w-full px-4 py-2.5 rounded-xl border border-dark/15 bg-white text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-dark/40 transition-colors'
const labelClasses = 'block text-sm font-medium text-dark mb-1.5'

export default function DonationsPage() {
  const { data: donations, setData, loading, error, reload } = useResource<Donation>('/api/donations')
  const { toast } = useToast()
  const { confirm } = useAlert()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')
  const [viewing, setViewing] = useState<Donation | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<DonationForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  const filtered = donations.filter((d) => {
    const matchSearch =
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `DN-${String(d.id).padStart(3, '0')}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter = activeFilter === 'all' || d.status.toLowerCase() === activeFilter
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
  const formatId = (id: number) => `DN-${String(id).padStart(3, '0')}`

  const exportCSV = () => {
    const header = ['ID', 'Donor Name', 'Email', 'Amount', 'Type', 'Date', 'Status']
    const rows = filtered.map((d) => [
      formatId(d.id),
      d.donorName,
      d.email,
      d.amount,
      d.type,
      d.date,
      d.status,
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          date: form.date || new Date().toISOString().slice(0, 10),
        }),
      })
      if (!res.ok) throw new Error()
      setFormOpen(false)
      setForm(emptyForm)
      toast('Donation recorded successfully')
      reload()
    } catch {
      toast('Failed to record the donation.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (donation: Donation, status: Donation['status']) => {
    setBusyId(donation.id)
    try {
      const res = await fetch(`/api/donations/${donation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast('Donation status updated')
      setData((prev) => prev.map((d) => (d.id === donation.id ? { ...d, status } : d)))
      setViewing((v) => (v && v.id === donation.id ? { ...v, status } : v))
    } catch {
      toast('Failed to update the donation status.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const deleteDonation = async (donation: Donation) => {
    confirm({
      title: 'Delete Donation',
      message: `Delete donation ${formatId(donation.id)} from ${donation.donorName}?`,
      icon: 'danger',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setBusyId(donation.id)
        try {
          const res = await fetch(`/api/donations/${donation.id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error()
          toast('Donation deleted successfully')
          setData((prev) => prev.filter((d) => d.id !== donation.id))
          setViewing(null)
        } catch {
          toast('Failed to delete the donation.', 'error')
        } finally {
          setBusyId(null)
        }
      },
    })
  }

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
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl border border-dark/15 bg-white px-5 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-dark/5"
            >
              <PiExport className="text-lg" />
              Export
            </button>
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-dark px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-dark/90"
            >
              <PiPlus className="text-lg" />
              Record Donation
            </button>
          </div>
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

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <PiSpinner className="mx-auto animate-spin text-2xl text-dark/30" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
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
                      <p className="text-xs text-dark/40">{formatId(d.id)}</p>
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
                      <button
                        onClick={() => setViewing(d)}
                        className="rounded-lg bg-dark/5 px-3 py-1.5 text-xs font-medium text-dark transition-colors hover:bg-dark hover:text-white"
                      >
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
          {loading ? (
            <div className="rounded-2xl border border-dark/10 bg-white p-12 text-center">
              <PiSpinner className="mx-auto animate-spin text-2xl text-dark/30" />
            </div>
          ) : filtered.length === 0 ? (
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
                  <button
                    onClick={() => setViewing(d)}
                    className="rounded-lg bg-dark/5 px-3 py-1.5 text-xs font-medium text-dark transition-colors hover:bg-dark hover:text-white"
                  >
                    View
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Record Donation Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Record Donation">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Donor name *</label>
              <input
                className={inputClasses}
                value={form.donorName}
                onChange={(e) => setForm((p) => ({ ...p, donorName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Email *</label>
              <input
                type="email"
                className={inputClasses}
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Amount (GH₵) *</label>
              <input
                type="number"
                min="1"
                step="any"
                className={inputClasses}
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <Select
                label="Type"
                value={form.type}
                onChange={(v) => setForm((p) => ({ ...p, type: v as Donation['type'] }))}
                options={[
                  { label: 'One-time', value: 'One-time' },
                  { label: 'Monthly', value: 'Monthly' },
                  { label: 'Sponsorship', value: 'Sponsorship' },
                ]}
              />
            </div>
            <div>
              <Select
                label="Status"
                value={form.status}
                onChange={(v) => setForm((p) => ({ ...p, status: v as Donation['status'] }))}
                options={[
                  { label: 'Completed', value: 'Completed' },
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Failed', value: 'Failed' },
                ]}
              />
            </div>
            <div>
              <label className={labelClasses}>Date</label>
              <input
                type="date"
                className={inputClasses}
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-dark/15 text-sm font-semibold text-dark hover:bg-dark/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark/90 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Record Donation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Donation Modal */}
      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing ? `Donation ${formatId(viewing.id)}` : ''}
        maxWidth="max-w-xl"
      >
        {viewing && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-dark/40">Donor</p>
                <p className="mt-1 font-semibold text-dark">{viewing.donorName}</p>
                <p className="text-sm text-dark/60">{viewing.email}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-dark/40">Amount</p>
                <p className="mt-1 text-2xl font-bold text-dark">{formatCurrency(viewing.amount)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-dark/40">Type</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${typeStyles[viewing.type]}`}>
                  {viewing.type}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-dark/40">Date</p>
                <p className="mt-1 text-sm text-dark/70">{viewing.date}</p>
              </div>
            </div>

            <div className="border-t border-dark/10 pt-4">
              <label className={labelClasses}>Update status</label>
              <div className="flex flex-wrap gap-2">
                {(['Completed', 'Pending', 'Failed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(viewing, s)}
                    disabled={busyId === viewing.id}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                      viewing.status === s
                        ? 'bg-dark text-white'
                        : 'bg-dark/5 text-dark hover:bg-dark/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-dark/10 pt-4">
              <button
                onClick={() => deleteDonation(viewing)}
                disabled={busyId === viewing.id}
                className="px-5 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
              >
                Delete Donation
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
