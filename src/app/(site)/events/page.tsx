'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PiCalendar, PiClock, PiMapPin, PiArrowRight, PiMagnifyingGlass } from 'react-icons/pi'

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  status: 'upcoming' | 'completed'
  imageUrl: string
}

const filters = ['All', 'Upcoming', 'Completed'] as const

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => {})
  }, [])

  const filteredEvents = events.filter((event) => {
    const matchesFilter =
      activeFilter === 'All' || event.status === activeFilter.toLowerCase()
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-40 pb-6 lg:pt-48 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="kicker mb-6">Events</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              What&apos;s Happening
            </h1>
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              Stay updated with our latest events, drives, and community gatherings.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`pill-tag text-xs ${
                    activeFilter === filter ? 'pill-tag-active' : ''
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <PiMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark/40" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-full border border-dark/20 focus:border-dark focus:ring-0 outline-none w-full md:w-64 bg-white"
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl border border-dark/10 overflow-hidden hover:border-dark/30 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        event.status === 'upcoming'
                          ? 'bg-lime text-dark'
                          : 'bg-dark/70 text-white'
                      }`}
                    >
                      {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="pill-tag text-xs self-start">{event.category}</span>
                    <h3 className="mt-3 text-lg font-serif text-dark">{event.title}</h3>
                    <p className="mt-2 text-dark/60 text-sm line-clamp-2">{event.description}</p>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-dark/50">
                      <span className="flex items-center gap-2">
                        <PiCalendar className="w-4 h-4 shrink-0" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-2">
                        <PiClock className="w-4 h-4 shrink-0" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <PiMapPin className="w-4 h-4 shrink-0" />
                        {event.location}
                      </span>
                    </div>
                    <div className="mt-auto pt-4">
                      <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 text-dark font-medium group">
                        {event.status === 'upcoming' ? 'Learn More' : 'View Recap'}
                        <PiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark/50">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
