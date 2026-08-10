'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  PiPlus,
  PiTrash,
  PiImage,
  PiPlayFill,
  PiMagnifyingGlass
} from 'react-icons/pi'

const mockGalleryData = [
  {
    id: 1,
    type: 'image' as const,
    category: 'Events' as const,
    title: 'Annual Fundraising Gala',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    type: 'video' as const,
    category: 'Programs' as const,
    title: 'After-School Tutoring',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    type: 'image' as const,
    category: 'Facilities' as const,
    title: 'New Playground Area',
    image: 'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    type: 'image' as const,
    category: 'Children' as const,
    title: 'Art Workshop Day',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    type: 'video' as const,
    category: 'Events' as const,
    title: 'Holiday Celebration',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    type: 'image' as const,
    category: 'Programs' as const,
    title: 'Music Lessons',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 7,
    type: 'image' as const,
    category: 'Facilities' as const,
    title: 'Library Reading Corner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 8,
    type: 'video' as const,
    category: 'Children' as const,
    title: 'Sports Day Highlights',
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba06879b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 9,
    type: 'image' as const,
    category: 'Events' as const,
    title: 'Community Outreach',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 10,
    type: 'image' as const,
    category: 'Programs' as const,
    title: 'Computer Literacy Class',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 11,
    type: 'video' as const,
    category: 'Facilities' as const,
    title: 'Dining Hall Renovation',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 12,
    type: 'image' as const,
    category: 'Children' as const,
    title: 'Garden Planting Day',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80'
  }
]

const categories = ['All', 'Events', 'Programs', 'Facilities', 'Children'] as const

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const filteredItems = mockGalleryData.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const deleteSelected = () => {
    setSelectedItems([])
  }

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-[#0e3b2b]">Gallery</h1>
          <button className="flex items-center gap-2 bg-[#7ed957] text-[#0e3b2b] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#6bc945] transition-colors">
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
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
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
                      }}
                      className="mt-1 flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <PiTrash className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <PiImage className="w-16 h-16 text-[#0e3b2b]/20 mx-auto mb-4" />
            <p className="text-[#0e3b2b]/50 text-lg font-medium">
              No items found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}