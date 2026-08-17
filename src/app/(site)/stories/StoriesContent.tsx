'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiClock, PiUser, PiArrowRight, PiMagnifyingGlass } from 'react-icons/pi'
import { stories } from '@/lib/stories'

const categories = ['All', 'Success Stories', 'Events', 'Announcements', 'Volunteer Spotlights']

export default function StoriesContent() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStories = stories.filter((story) => {
    const matchesCategory = activeCategory === 'All' || story.category === activeCategory
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredStory = stories.find((s) => s.featured)

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-40 pb-6 lg:pt-48 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="kicker mb-6">Our Blog</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              Stories of Hope
            </h1>
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              Read inspiring stories of transformation, learn about our events, and stay
              updated with our latest news.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredStory && (
        <section className="section-padding bg-cream">
          <div className="container-premium">
            <Link href={`/stories/${featuredStory.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card-premium overflow-hidden hover:border-dark/30 transition-all duration-300"
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto">
                    <Image
                      src={featuredStory.image}
                      alt={featuredStory.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-8 lg:p-12">
                    <span className="pill-tag text-xs mb-4">{featuredStory.category}</span>
                    <h2 className="mt-2 text-2xl lg:text-3xl font-serif text-dark">
                      {featuredStory.title}
                    </h2>
                    <p className="mt-4 text-dark/60 leading-relaxed">{featuredStory.excerpt}</p>
                    <div className="mt-6 flex items-center gap-6 text-sm text-dark/50">
                      <span className="flex items-center gap-1">
                        <PiUser className="w-4 h-4" />
                        {featuredStory.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <PiClock className="w-4 h-4" />
                        {featuredStory.readTime}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-dark font-medium group">
                      Read More
                      <PiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </section>
      )}

      {/* Stories Grid */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`pill-tag text-xs ${
                    activeCategory === category
                      ? 'pill-tag-active'
                      : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <PiMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark/40" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-full border border-dark/20 focus:border-dark focus:ring-0 outline-none w-full md:w-64 bg-white"
              />
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/stories/${story.id}`} className="block group">
                  <div className="card-premium overflow-hidden hover:border-dark/30 transition-all duration-300 h-full">
                    <div className="relative h-48">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                    <div className="p-6">
                      <span className="pill-tag text-xs">{story.category}</span>
                      <h3 className="mt-3 text-lg font-serif text-dark group-hover:text-dark-100 transition-colors">
                        {story.title}
                      </h3>
                      <p className="mt-2 text-dark/60 text-sm line-clamp-2">{story.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-sm text-dark/50">
                        <span className="flex items-center gap-1">
                          <PiClock className="w-4 h-4" />
                          {story.readTime}
                        </span>
                        <span>{story.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark/50">No stories found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
