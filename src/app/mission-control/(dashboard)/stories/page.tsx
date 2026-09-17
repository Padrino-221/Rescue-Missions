'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiMagnifyingGlass,
  PiEye,
  PiSpinner,
  PiNewspaper,
  PiFloppyDisk,
  PiSparkle,
} from 'react-icons/pi'
import { useResource } from '@/lib/useResource'
import { useSettings } from '@/lib/useSettings'
import Modal from '@/components/dashboard/Modal'
import ImageUpload from '@/components/ui/ImageUpload'
import Select from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import { useAlert } from '@/components/ui/Alert'

type Story = {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  featured: boolean
  image: string
  content: string
}

const defaultCategories = ['All', 'Success Stories', 'Events', 'Announcements', 'Volunteer Spotlights']

const emptyForm = {
  title: '',
  excerpt: '',
  category: '',
  author: '',
  date: '',
  readTime: '',
  featured: false,
  image: '',
  content: '',
}

const inputClasses =
  'w-full px-4 py-3 rounded-2xl border border-dark/15 bg-white text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:border-dark/40 focus:ring-4 focus:ring-lime/20 transition-all'
const labelClasses = 'block text-xs font-semibold uppercase tracking-wide text-dark/50 mb-2'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-dark/45">{children}</h3>
      <span className="h-px flex-1 bg-dark/10" />
    </div>
  )
}

export default function StoriesPage() {
  const { data: stories, loading, error, reload } = useResource<Story>('/api/stories')
  const { settings } = useSettings()
  const { toast } = useToast()
  const { confirm } = useAlert()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const configuredCategories = settings?.stories?.categories
  const categories = configuredCategories?.length
    ? configuredCategories.includes('All')
      ? configuredCategories
      : ['All', ...configuredCategories]
    : defaultCategories

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewing, setViewing] = useState<Story | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || story.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const openNew = () => {
    setForm({ ...emptyForm, category: categories.find((c) => c !== 'All') ?? '' })
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (story: Story) => {
    setForm({
      title: story.title,
      excerpt: story.excerpt,
      category: story.category,
      author: story.author,
      date: story.date,
      readTime: story.readTime,
      featured: story.featured,
      image: story.image,
      content: story.content,
    })
    setEditingId(story.id)
    setFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(editingId ? `/api/stories/${editingId}` : '/api/stories', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      setFormOpen(false)
      toast(editingId ? 'Story updated successfully' : 'Story created successfully')
      reload()
    } catch {
      toast('Failed to save the story. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (story: Story) => {
    confirm({
      title: 'Delete Story',
      message: `Delete "${story.title}"? This cannot be undone.`,
      icon: 'danger',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setBusyId(story.id)
        try {
          const res = await fetch(`/api/stories/${story.id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Delete failed')
          toast('Story deleted successfully')
          reload()
        } catch {
          toast('Failed to delete the story.', 'error')
        } finally {
          setBusyId(null)
        }
      },
    })
  }

  const update = (field: keyof typeof emptyForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen bg-cream">
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-dark">Stories</h1>
          <p className="text-sm text-dark/50 mt-1">
            Manage the articles shown on the public Stories page.
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openNew}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 bg-lime text-dark font-semibold rounded-xl hover:bg-lime/90 transition-colors self-start"
        >
          <PiPlus className="text-lg" />
          New Story
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <PiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/40 text-lg" />
        <input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-dark/10 rounded-xl text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime transition-all"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category
                ? 'bg-lime text-dark'
                : 'bg-white text-dark/60 border border-dark/10 hover:border-dark/20'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-dark/10 overflow-hidden overflow-x-hidden"
      >
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark/10">
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">Title</th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">Category</th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">Author</th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">Date</th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">Placement</th>
                <th className="text-right text-sm font-semibold text-dark/60 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <PiSpinner className="mx-auto animate-spin text-2xl text-dark/30" />
                  </td>
                </tr>
              ) : (
                filteredStories.map((story, index) => (
                  <motion.tr
                    key={story.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-b border-dark/5 last:border-0 hover:bg-dark/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark/5 overflow-hidden flex-shrink-0">
                          <Image src={story.image} alt={story.title} width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-dark text-sm">{story.title}</p>
                          <p className="text-xs text-dark/50 line-clamp-1">{story.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-dark/70">{story.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-dark/70">{story.author}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-dark/70">{story.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          story.featured ? 'bg-lime/20 text-dark' : 'bg-dark/10 text-dark/60'
                        }`}
                      >
                        {story.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewing(story)}
                          className="p-2 text-dark/40 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                          title="View"
                        >
                          <PiEye className="text-lg" />
                        </button>
                        <button
                          onClick={() => openEdit(story)}
                          className="p-2 text-dark/40 hover:text-lime hover:bg-lime/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <PiPencilSimple className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(story)}
                          disabled={busyId === story.id}
                          className="p-2 text-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {busyId === story.id ? (
                            <PiSpinner className="text-lg animate-spin" />
                          ) : (
                            <PiTrash className="text-lg" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl border border-dark/10 p-12 text-center">
              <PiSpinner className="mx-auto animate-spin text-2xl text-dark/30" />
            </div>
          ) : (
            filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-2xl border border-dark/10 p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-dark/5 overflow-hidden flex-shrink-0">
                    <Image src={story.image} alt={story.title} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-dark text-sm">{story.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                          story.featured ? 'bg-lime/20 text-dark' : 'bg-dark/10 text-dark/60'
                        }`}
                      >
                        {story.featured ? 'Featured' : 'Standard'}
                      </span>
                    </div>
                    <p className="text-xs text-dark/50 line-clamp-2 mt-1">{story.excerpt}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dark/50 mb-4">
                  <span>{story.category}</span>
                  <span>{story.author}</span>
                  <span>{story.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      story.featured ? 'bg-lime/15 text-dark' : 'bg-dark/10 text-dark/60'
                    }`}
                  >
                    {story.featured ? 'Featured' : 'Standard'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewing(story)}
                      className="p-2 text-dark/40 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                      title="View"
                    >
                      <PiEye className="text-lg" />
                    </button>
                    <button
                      onClick={() => openEdit(story)}
                      className="p-2 text-dark/40 hover:text-lime hover:bg-lime/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PiPencilSimple className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(story)}
                      disabled={busyId === story.id}
                      className="p-2 text-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {busyId === story.id ? (
                        <PiSpinner className="text-lg animate-spin" />
                      ) : (
                        <PiTrash className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!loading && filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark/40 text-sm">No stories found matching your search.</p>
          </div>
        )}
      </motion.div>

      {/* Create / Edit Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Edit story' : 'New story'}
        subtitle={
          editingId
            ? 'Update the details and save your changes.'
            : 'Share an update, story, or announcement with your audience.'
        }
        icon={<PiNewspaper className="text-xl" />}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-dark/15 text-sm font-semibold text-dark transition-colors hover:bg-dark/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="story-form"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold transition-colors hover:bg-dark-50 disabled:opacity-60"
            >
              {saving ? (
                <PiSpinner className="animate-spin" />
              ) : (
                <PiFloppyDisk className="text-base" />
              )}
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create story'}
            </button>
          </div>
        }
      >
        <form id="story-form" onSubmit={handleSave} className="space-y-8">
          <section className="space-y-4">
            <SectionLabel>Story details</SectionLabel>
            <div>
              <label className={labelClasses}>Title *</label>
              <input
                className={`${inputClasses} text-base font-semibold`}
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. How education changed Mary's life"
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Excerpt</label>
              <textarea
                className={`${inputClasses} resize-none`}
                rows={2}
                value={form.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                placeholder="A short summary shown on cards and previews"
              />
            </div>
            <div>
              <label className={labelClasses}>Content</label>
              <textarea
                className={`${inputClasses} resize-none leading-relaxed`}
                rows={9}
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                placeholder="Write the full story here..."
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Organize</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                value={form.category}
                onChange={(v) => update('category', v)}
                options={categories.filter((c) => c !== 'All').map((c) => ({ label: c, value: c }))}
              />
              <div>
                <label className={labelClasses}>Author</label>
                <input
                  className={inputClasses}
                  value={form.author}
                  onChange={(e) => update('author', e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className={labelClasses}>Date</label>
                <input
                  className={inputClasses}
                  value={form.date}
                  placeholder="e.g. March 15, 2024"
                  onChange={(e) => update('date', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClasses}>Read time</label>
                <input
                  className={inputClasses}
                  value={form.readTime}
                  placeholder="e.g. 5 min read"
                  onChange={(e) => update('readTime', e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Cover image</SectionLabel>
            <ImageUpload value={form.image} onChange={(v) => update('image', v)} folder="rescue-mission/stories" label="Story Image" />
          </section>

          <section className="space-y-4">
            <SectionLabel>Visibility</SectionLabel>
            <button
              type="button"
              onClick={() => update('featured', !form.featured)}
              className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-colors ${
                form.featured ? 'border-lime bg-lime/10' : 'border-dark/15 bg-white hover:border-dark/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                    form.featured ? 'bg-lime text-dark' : 'bg-dark/5 text-dark/40'
                  }`}
                >
                  <PiSparkle className="text-base" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-dark">Feature this story</span>
                  <span className="mt-0.5 block text-xs text-dark/50">
                    Featured stories are highlighted at the top of the public Stories page.
                  </span>
                </span>
              </div>
              <span
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                  form.featured ? 'bg-dark' : 'bg-dark/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    form.featured ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </section>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing?.title ?? ''}
        icon={<PiEye className="text-xl" />}
        maxWidth="max-w-2xl"
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-dark/50">
              <span className="px-2.5 py-1 rounded-full bg-lime/20 text-dark font-medium">{viewing.category}</span>
              <span>By {viewing.author}</span>
              <span>{viewing.date}</span>
              <span>{viewing.readTime}</span>
            </div>
            {viewing.image && (
              <div className="relative w-full h-56 rounded-xl overflow-hidden">
                <Image src={viewing.image} alt={viewing.title} fill className="object-cover" />
              </div>
            )}
            <p className="text-dark/70 italic">{viewing.excerpt}</p>
            <div className="whitespace-pre-line text-dark/80 leading-relaxed">{viewing.content}</div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setViewing(null)
                  openEdit(viewing)
                }}
                className="px-5 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark/90 transition-colors"
              >
                Edit Story
              </button>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </div>
  )
}
