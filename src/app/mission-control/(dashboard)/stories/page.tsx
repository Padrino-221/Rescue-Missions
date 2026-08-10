'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PiPlus,
  PiPencilSimple,
  PiTrash,
  PiMagnifyingGlass,
  PiEye
} from 'react-icons/pi'
import { stories } from '@/lib/stories'

type Story = typeof stories[number]

const categories = ['All', 'Success Stories', 'Events', 'Announcements', 'Volunteer Spotlights'] as const

export default function StoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      activeCategory === 'All' || story.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-dark"
        >
          Stories
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary inline-flex items-center gap-2 px-4 py-2 bg-lime text-dark font-semibold rounded-xl hover:bg-lime/90 transition-colors"
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-dark/10 overflow-hidden"
      >
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark/10">
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">
                  Title
                </th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">
                  Category
                </th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">
                  Author
                </th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">
                  Date
                </th>
                <th className="text-left text-sm font-semibold text-dark/60 px-6 py-4">
                  Status
                </th>
                <th className="text-right text-sm font-semibold text-dark/60 px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStories.map((story, index) => (
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
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-dark text-sm">
                          {story.title}
                        </p>
                        <p className="text-xs text-dark/50 line-clamp-1">
                          {story.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark/70">
                      {story.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark/70">
                      {story.author}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark/70">
                      {story.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        story.featured
                          ? 'bg-lime/20 text-dark'
                          : 'bg-dark/10 text-dark/60'
                      }`}
                    >
                      {story.featured ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-dark/40 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                        title="View"
                      >
                        <PiEye className="text-lg" />
                      </button>
                      <button
                        className="p-2 text-dark/40 hover:text-lime hover:bg-lime/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PiPencilSimple className="text-lg" />
                      </button>
                      <button
                        className="p-2 text-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <PiTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-dark/5">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-dark/5 overflow-hidden flex-shrink-0">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-dark text-sm truncate">
                      {story.title}
                    </p>
                    <p className="text-xs text-dark/50 truncate">
                      {story.excerpt}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    story.featured
                      ? 'bg-lime/20 text-dark'
                      : 'bg-dark/10 text-dark/60'
                  }`}
                >
                  {story.featured ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-dark/50">
                <span>{story.category}</span>
                <span>{story.author}</span>
                <span>{story.date}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  className="p-2 text-dark/40 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                  title="View"
                >
                  <PiEye className="text-lg" />
                </button>
                <button
                  className="p-2 text-dark/40 hover:text-lime hover:bg-lime/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <PiPencilSimple className="text-lg" />
                </button>
                <button
                  className="p-2 text-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <PiTrash className="text-lg" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark/40 text-sm">
              No stories found matching your search.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
