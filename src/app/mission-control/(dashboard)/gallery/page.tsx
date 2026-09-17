'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  PiPlus,
  PiTrash,
  PiImage,
  PiPlayFill,
  PiMagnifyingGlass,
  PiSpinner,
  PiFloppyDisk,
} from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import Modal from '@/components/dashboard/Modal'
import ImageUpload from '@/components/ui/ImageUpload'
import Select from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import { useAlert } from '@/components/ui/Alert'

type GalleryItem = {
  id: number
  type: 'image' | 'video'
  category: string
  title: string
  alt: string
  image: string
}

type GalleryForm = {
  id: number | null
  title: string
  category: string
  type: GalleryItem['type']
  alt: string
  image: string
}

const fallbackCategories = ['Events', 'Programs', 'Facilities', 'Children']

const emptyForm: GalleryForm = {
  id: null,
  title: '',
  category: 'Events',
  type: 'image',
  alt: '',
  image: '',
}

const inputClasses =
  'w-full px-4 py-3 rounded-2xl border border-[#0e3b2b]/15 bg-white text-sm text-[#0e3b2b] placeholder:text-[#0e3b2b]/35 focus:outline-none focus:border-[#0e3b2b]/40 focus:ring-4 focus:ring-[#7ed957]/20 transition-all'
const labelClasses = 'block text-xs font-semibold uppercase tracking-wide text-[#0e3b2b]/50 mb-2'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0e3b2b]/45">{children}</h3>
      <span className="h-px flex-1 bg-[#0e3b2b]/10" />
    </div>
  )
}

export default function GalleryPage() {
  const { settings, loading } = useSettings()
  const { toast } = useToast()
  const { confirm } = useAlert()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<GalleryForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [busyIds, setBusyIds] = useState<number[]>([])

  const bulkBusy = selectedItems.length > 0 && selectedItems.every((id) => busyIds.includes(id))

  useEffect(() => {
    if (settings?.gallery?.items) {
      const next = settings.gallery.items as unknown as GalleryItem[]
      queueMicrotask(() => setItems(next))
    }
  }, [settings])

  const categories = settings?.gallery?.categories?.filter((c) => c && c !== 'All') ?? fallbackCategories

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const persist = async (next: GalleryItem[]) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gallery: { items: next } }),
    })
    if (!res.ok) throw new Error('Save failed')
    setItems(next)
  }

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const deleteItem = async (id: number) => {
    const item = items.find((i) => i.id === id)
    confirm({
      title: 'Delete Item',
      message: `Delete "${item?.title ?? 'this item'}" from the gallery?`,
      icon: 'danger',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setBusyIds((prev) => [...prev, id])
        try {
          await persist(items.filter((i) => i.id !== id))
          setSelectedItems((prev) => prev.filter((i) => i !== id))
          toast('Item deleted successfully')
        } catch {
          toast('Failed to delete the item.', 'error')
        } finally {
          setBusyIds((prev) => prev.filter((i) => i !== id))
        }
      },
    })
  }

  const deleteSelected = async () => {
    confirm({
      title: 'Delete Selected',
      message: `Delete ${selectedItems.length} selected item(s)?`,
      icon: 'danger',
      confirmLabel: 'Delete',
      onConfirm: async () => {
        setBusyIds((prev) => [...new Set([...prev, ...selectedItems])])
        try {
          await persist(items.filter((i) => !selectedItems.includes(i.id)))
          setSelectedItems([])
          toast('Selected items deleted successfully')
        } catch {
          toast('Failed to delete some items.', 'error')
        } finally {
          setBusyIds((prev) => prev.filter((id) => !selectedItems.includes(id)))
        }
      },
    })
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const item: GalleryItem = {
        id: form.id ?? Date.now(),
        title: form.title,
        category: form.category,
        type: form.type,
        alt: form.alt,
        image: form.image,
      }
      const next = form.id
        ? items.map((i) => (i.id === form.id ? item : i))
        : [item, ...items]
      await persist(next)
      setFormOpen(false)
      setForm(emptyForm)
      toast(form.id ? 'Gallery item updated successfully' : 'Item added to gallery successfully')
    } catch {
      toast('Failed to save the item.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0e3b2b]">Gallery</h1>
            <p className="text-[#0e3b2b]/60 mt-1">Manage the photos and videos shown on the public Gallery page</p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setFormOpen(true) }}
            className="flex items-center gap-2 bg-[#7ed957] text-[#0e3b2b] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#6bc945] transition-colors self-start"
          >
            <PiPlus className="w-5 h-5" />
            Add item
          </button>
        </div>

        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 p-3 bg-[#0e3b2b] text-white rounded-xl"
          >
            <span className="text-sm font-medium">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={deleteSelected}
              disabled={bulkBusy}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkBusy ? <PiSpinner className="w-4 h-4 animate-spin" /> : <PiTrash className="w-4 h-4" />}
              Delete
            </button>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <PiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0e3b2b]/40" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#0e3b2b]/10 rounded-xl text-[#0e3b2b] placeholder:text-[#0e3b2b]/40 focus:outline-none focus:ring-2 focus:ring-[#7ed957] transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['All', ...categories].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-[#0e3b2b] text-white'
                    : 'bg-white border border-[#0e3b2b]/10 text-[#0e3b2b]/60 hover:border-[#7ed957] hover:text-[#0e3b2b]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#0e3b2b]/10 bg-white p-16 text-center">
            <PiSpinner className="mx-auto animate-spin text-2xl text-[#0e3b2b]/30" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative bg-white rounded-2xl border border-[#0e3b2b]/10 overflow-hidden cursor-pointer group ${
                  selectedItems.includes(item.id)
                    ? 'ring-2 ring-[#7ed957] ring-offset-2'
                    : ''
                }`}
                onClick={() => toggleSelect(item.id)}
              >
                <div className="relative aspect-square bg-[#0e3b2b]/5">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.alt || item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  )}

                  <div
                    className={`absolute inset-0 bg-[#0e3b2b]/0 group-hover:bg-[#0e3b2b]/50 transition-all duration-300 flex flex-col items-center justify-center p-3`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 text-white w-full">
                      <div className="flex items-center gap-1.5">
                        {item.type === 'video' && (
                          <span className="flex items-center gap-1 bg-[#7ed957] text-[#0e3b2b] text-xs font-semibold px-2 py-0.5 rounded-full">
                            <PiPlayFill className="w-3 h-3" />
                            Video
                          </span>
                        )}
                        {item.type === 'image' && (
                          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                            <PiImage className="w-3 h-3" />
                            Image
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-center leading-tight">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setForm({
                              id: item.id,
                              title: item.title,
                              category: item.category,
                              type: item.type,
                              alt: item.alt ?? '',
                              image: item.image,
                            })
                            setFormOpen(true)
                          }}
                          className="mt-1 flex items-center gap-1 bg-[#7ed957] hover:bg-[#6bc945] text-[#0e3b2b] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteItem(item.id)
                          }}
                          disabled={busyIds.includes(item.id)}
                          className="mt-1 flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          {busyIds.includes(item.id) ? (
                            <PiSpinner className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <PiTrash className="w-3.5 h-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <PiImage className="w-16 h-16 text-[#0e3b2b]/20 mx-auto mb-4" />
            <p className="text-[#0e3b2b]/50 text-lg font-medium">
              No items found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? 'Edit gallery item' : 'Add to gallery'}
        subtitle={form.id ? 'Update the details and save your changes.' : 'Add a photo or video to the public Gallery page.'}
        icon={<PiImage className="text-xl" />}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-[#0e3b2b]/15 text-sm font-semibold text-[#0e3b2b] transition-colors hover:bg-[#0e3b2b]/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="gallery-form"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0e3b2b] text-white text-sm font-semibold transition-colors hover:bg-[#0e3b2b]/90 disabled:opacity-60"
            >
              {saving ? <PiSpinner className="animate-spin" /> : <PiFloppyDisk className="text-base" />}
              {saving ? 'Saving...' : form.id ? 'Save changes' : 'Add to gallery'}
            </button>
          </div>
        }
      >
        <form id="gallery-form" onSubmit={handleUpload} className="space-y-8">
          <section className="space-y-4">
            <SectionLabel>Details</SectionLabel>
            <div>
              <label className={labelClasses}>Title *</label>
              <input
                className={`${inputClasses} font-semibold`}
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Annual fundraising gala"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                value={form.category}
                onChange={(v) => setForm((p) => ({ ...p, category: v }))}
                options={categories.map((c) => ({ label: c, value: c }))}
              />
              <Select
                label="Type"
                value={form.type}
                onChange={(v) => setForm((p) => ({ ...p, type: v as GalleryItem['type'] }))}
                options={[
                  { label: 'Image', value: 'image' },
                  { label: 'Video', value: 'video' },
                ]}
              />
            </div>
            <div>
              <label className={labelClasses}>Alt Text</label>
              <input
                className={inputClasses}
                value={form.alt}
                onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))}
                placeholder="Describe the image for accessibility"
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionLabel>Media</SectionLabel>
            <ImageUpload value={form.image} onChange={(v) => setForm((p) => ({ ...p, image: v }))} folder="rescue-mission/gallery" label="Gallery Image" />
          </section>
        </form>
      </Modal>
    </div>
  )
}
