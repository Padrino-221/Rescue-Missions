'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  PiPlus,
  PiTrash,
  PiImage,
  PiPlayFill,
  PiMagnifyingGlass,
  PiSpinner,
} from 'react-icons/pi'
import { useResource } from '@/lib/useResource'
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
  image: string
}

const categories = ['All', 'Events', 'Programs', 'Facilities', 'Children'] as const

type GalleryForm = {
  title: string
  category: string
  type: GalleryItem['type']
  image: string
}

const emptyForm: GalleryForm = { title: '', category: 'Events', type: 'image', image: '' }

const inputClasses =
  'w-full px-4 py-2.5 rounded-xl border border-[#0e3b2b]/15 bg-white text-sm text-[#0e3b2b] placeholder:text-[#0e3b2b]/35 focus:outline-none focus:border-[#0e3b2b]/40 transition-colors'
const labelClasses = 'block text-sm font-medium text-[#0e3b2b] mb-1.5'

export default function GalleryPage() {
  const { data: items, setData, loading, error, reload } = useResource<GalleryItem>('/api/gallery')
  const { toast } = useToast()
  const { confirm } = useAlert()
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<GalleryForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [busyIds, setBusyIds] = useState<number[]>([])

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
          const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error()
          toast('Item deleted successfully')
          setData((prev) => prev.filter((i) => i.id !== id))
          setSelectedItems((prev) => prev.filter((i) => i !== id))
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
          await Promise.all(selectedItems.map((id) => fetch(`/api/gallery/${id}`, { method: 'DELETE' })))
          toast('Selected items deleted successfully')
          setData((prev) => prev.filter((i) => !selectedItems.includes(i.id)))
          setSelectedItems([])
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
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setFormOpen(false)
      setForm(emptyForm)
      toast('Item added to gallery successfully')
      reload()
    } catch {
      toast('Failed to add the item.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-[#0e3b2b]">Gallery</h1>
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 bg-[#7ed957] text-[#0e3b2b] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#6bc945] transition-colors self-start"
          >
            <PiPlus className="w-5 h-5" />
            Upload
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
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <PiTrash className="w-4 h-4" />
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
            {categories.map((category) => (
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

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

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
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />

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
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add to Gallery">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className={labelClasses}>Title *</label>
            <input
              className={inputClasses}
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Select
                label="Category"
                value={form.category}
                onChange={(v) => setForm((p) => ({ ...p, category: v }))}
                options={categories.filter((c) => c !== 'All').map((c) => ({ label: c, value: c }))}
              />
            </div>
            <div>
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
          </div>
          <div>
            <ImageUpload value={form.image} onChange={(v) => setForm((p) => ({ ...p, image: v }))} folder="rescue-mission/gallery" label="Gallery Image" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-[#0e3b2b]/15 text-sm font-semibold text-[#0e3b2b] hover:bg-[#0e3b2b]/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0e3b2b] text-white text-sm font-semibold hover:bg-[#0e3b2b]/90 transition-colors disabled:opacity-60"
            >
              {saving ? 'Adding...' : 'Add to Gallery'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
