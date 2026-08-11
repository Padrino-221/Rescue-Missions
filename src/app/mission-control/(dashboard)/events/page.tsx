'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiCalendar,
  PiClock,
  PiMapPin,
  PiX,
  PiSpinner,
  PiMagnifyingGlass,
} from 'react-icons/pi'
import Select from '@/components/ui/Select'
import ImageUpload from '@/components/ui/ImageUpload'
import { useToast } from '@/components/ui/Toast'
import { useAlert } from '@/components/ui/Alert'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  status: string
  imageUrl: string
}

const defaultFormState = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: 'Community',
  status: 'upcoming',
  imageUrl: '',
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formState, setFormState] = useState(defaultFormState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()
  const { confirm } = useAlert()

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data)
    } catch (err) {
      console.error('Failed to fetch events:', err)
    } finally {
      setLoading(false)
    }
  }

  function filteredEvents() {
    return events
      .filter((e) => {
        if (activeFilter === 'upcoming') return e.status === 'upcoming'
        if (activeFilter === 'completed') return e.status === 'completed'
        return true
      })
      .filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }

  function openCreateModal() {
    setEditingEvent(null)
    setFormState(defaultFormState)
    setShowModal(true)
  }

  function openEditModal(event: Event) {
    setEditingEvent(event)
    setFormState({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      status: event.status,
      imageUrl: event.imageUrl,
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingEvent(null)
    setFormState(defaultFormState)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      if (res.ok) {
        toast(editingEvent ? 'Event updated successfully' : 'Event created successfully')
        await fetchEvents()
        closeModal()
      } else {
        toast('Failed to save event.', 'error')
      }
    } catch (err) {
      toast('Failed to save event.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function handleDelete(id: string) {
    confirm({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This cannot be undone.',
      icon: 'danger',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setDeletingId(id)
        try {
          const res = await fetch(`/api/events/${id}`, { method: 'DELETE' })
          if (res.ok) {
            toast('Event deleted successfully')
            await fetchEvents()
          } else {
            toast('Failed to delete event.', 'error')
          }
        } catch (err) {
          toast('Failed to delete event.', 'error')
        } finally {
          setDeletingId(null)
        }
      },
    })
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const filtered = filteredEvents()

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0e3b2b]">Events</h1>
            <p className="text-[#0e3b2b]/60 mt-1">Manage orphanage events and activities</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-3 bg-[#7ed957] text-[#0e3b2b] font-semibold rounded-xl hover:bg-[#6bc748] transition-colors"
          >
            <PiPlus size={20} />
            New Event
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                  activeFilter === filter
                    ? 'bg-[#0e3b2b] text-[#f8fbf6]'
                    : 'bg-white text-[#0e3b2b]/60 hover:bg-[#0e3b2b]/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <PiMagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0e3b2b]/40"
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#0e3b2b]/15 bg-white text-[#0e3b2b] text-sm focus:outline-none focus:border-[#0e3b2b]/40"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <PiSpinner size={32} className="animate-spin text-[#7ed957]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#0e3b2b]/10">
            <PiCalendar size={48} className="mx-auto text-[#0e3b2b]/20 mb-4" />
            <p className="text-[#0e3b2b]/50 text-lg">No events found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-[#0e3b2b]/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0e3b2b]/10">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e3b2b]/60">
                      Event
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e3b2b]/60">
                      Date & Time
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e3b2b]/60">
                      Location
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e3b2b]/60">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0e3b2b]/60">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-[#0e3b2b]/60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((event, i) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-[#0e3b2b]/5 last:border-0 hover:bg-[#f8fbf6] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#0e3b2b]">{event.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#0e3b2b]/70">
                          <PiCalendar size={14} />
                          {formatDate(event.date)}
                          <PiClock size={14} className="ml-1" />
                          {event.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#0e3b2b]/70">
                          <PiMapPin size={14} />
                          {event.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg bg-[#7ed957]/15 text-[#0e3b2b] text-xs font-medium">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            event.status === 'upcoming'
                              ? 'bg-[#7ed957]/20 text-[#0e3b2b]'
                              : 'bg-[#0e3b2b]/10 text-[#0e3b2b]/60'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-2 rounded-lg hover:bg-[#0e3b2b]/10 text-[#0e3b2b]/50 hover:text-[#0e3b2b] transition-colors"
                          >
                            <PiPencilSimple size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            disabled={deletingId === event.id}
                            className="p-2 rounded-lg hover:bg-red-50 text-[#0e3b2b]/50 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            {deletingId === event.id ? (
                              <PiSpinner size={18} className="animate-spin" />
                            ) : (
                              <PiTrash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-[#0e3b2b]/10 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#0e3b2b]">{event.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        event.status === 'upcoming'
                          ? 'bg-[#7ed957]/20 text-[#0e3b2b]'
                          : 'bg-[#0e3b2b]/10 text-[#0e3b2b]/60'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-[#0e3b2b]/70 mb-4">
                    <div className="flex items-center gap-2">
                      <PiCalendar size={14} />
                      {formatDate(event.date)} &middot; {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <PiMapPin size={14} />
                      {event.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-[#7ed957]/15 text-[#0e3b2b] text-xs font-medium">
                      {event.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 rounded-lg hover:bg-[#0e3b2b]/10 text-[#0e3b2b]/50 hover:text-[#0e3b2b] transition-colors"
                      >
                        <PiPencilSimple size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="p-2 rounded-lg hover:bg-red-50 text-[#0e3b2b]/50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === event.id ? (
                          <PiSpinner size={18} className="animate-spin" />
                        ) : (
                          <PiTrash size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#0e3b2b]/10">
              <h2 className="text-lg font-bold text-[#0e3b2b]">
                {editingEvent ? 'Edit Event' : 'New Event'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-[#0e3b2b]/10 text-[#0e3b2b]/50 hover:text-[#0e3b2b] transition-colors"
              >
                <PiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0e3b2b] mb-2">Title</label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#0e3b2b]/15 bg-white text-[#0e3b2b] text-sm focus:outline-none focus:border-[#0e3b2b]/40"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0e3b2b] mb-2">
                  Description
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#0e3b2b]/15 bg-white text-[#0e3b2b] text-sm focus:outline-none focus:border-[#0e3b2b]/40 resize-none"
                  placeholder="Event description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0e3b2b] mb-2">Date</label>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#0e3b2b]/15 bg-white text-[#0e3b2b] text-sm focus:outline-none focus:border-[#0e3b2b]/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0e3b2b] mb-2">Time</label>
                  <input
                    type="text"
                    value={formState.time}
                    onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#0e3b2b]/15 bg-white text-[#0e3b2b] text-sm focus:outline-none focus:border-[#0e3b2b]/40"
                    placeholder="e.g. 10:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0e3b2b] mb-2">Location</label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#0e3b2b]/15 bg-white text-[#0e3b2b] text-sm focus:outline-none focus:border-[#0e3b2b]/40"
                  placeholder="Event location"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Category"
                    value={formState.category}
                    onChange={(v) => setFormState({ ...formState, category: v })}
                    options={[
                      { label: 'Fundraiser', value: 'Fundraiser' },
                      { label: 'Community', value: 'Community' },
                      { label: 'Volunteer', value: 'Volunteer' },
                      { label: 'Celebration', value: 'Celebration' },
                      { label: 'Healthcare', value: 'Healthcare' },
                      { label: 'Education', value: 'Education' },
                      { label: 'Other', value: 'Other' },
                    ]}
                  />
                </div>
                <div>
                  <Select
                    label="Status"
                    value={formState.status}
                    onChange={(v) => setFormState({ ...formState, status: v })}
                    options={[
                      { label: 'Upcoming', value: 'upcoming' },
                      { label: 'Completed', value: 'completed' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <ImageUpload value={formState.imageUrl} onChange={(v) => setFormState({ ...formState, imageUrl: v })} folder="rescue-mission/events" label="Event Image" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#0e3b2b]/10">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#0e3b2b]/60 hover:bg-[#0e3b2b]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formState.title}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7ed957] text-[#0e3b2b] text-sm font-semibold hover:bg-[#6bc748] transition-colors disabled:opacity-50"
              >
                {saving && <PiSpinner size={16} className="animate-spin" />}
                {editingEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
