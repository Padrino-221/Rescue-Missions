'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PiCalendar,
  PiClock,
  PiMapPin,
  PiArrowLeft,
  PiTag,
  PiShareNetwork,
} from 'react-icons/pi'

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

export default function EventDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => setEvent(data))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <section className="bg-cream pt-40 pb-8 lg:pt-48 lg:pb-10">
        <div className="container-premium">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 bg-dark/10 rounded-full" />
            <div className="h-12 w-3/4 bg-dark/10 rounded-2xl" />
            <div className="h-8 w-24 bg-dark/10 rounded-full" />
            <div className="h-[400px] w-full bg-dark/10 rounded-[2rem]" />
          </div>
        </div>
      </section>
    )
  }

  if (!event) {
    return (
      <section className="bg-cream pt-40 pb-8 lg:pt-48 lg:pb-10">
        <div className="container-premium text-center py-20">
          <h1 className="text-4xl font-serif text-dark">Event not found</h1>
          <p className="mt-4 text-dark/60">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 mt-8 btn-primary"
          >
            <PiArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-40 pb-8 lg:pt-48 lg:pb-10 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-dark/60 hover:text-dark transition-colors mb-6 text-sm font-medium"
            >
              <PiArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>

            <span className="pill-tag text-xs mb-4">{event.category}</span>

            <h1 className="text-4xl sm:text-5xl font-serif text-dark mt-4">
              {event.title}
            </h1>

            <span
              className={`inline-block mt-4 rounded-full px-4 py-1.5 text-sm font-bold ${
                event.status === 'upcoming'
                  ? 'bg-lime text-dark'
                  : 'bg-dark/70 text-white'
              }`}
            >
              {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Event Image */}
      <section className="bg-cream">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-[2rem] overflow-hidden aspect-[21/9]"
          >
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Event Details */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-serif text-dark mb-6">
                About This Event
              </h2>
              <p className="text-dark/70 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </motion.div>

            {/* Right Column - Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="card-premium p-6 lg:p-8 sticky top-28">
                <h3 className="text-lg font-serif text-dark mb-6">
                  Event Details
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                      <PiCalendar className="w-5 h-5 text-dark" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dark/50 mb-1">
                        Date
                      </p>
                      <p className="text-dark font-medium">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                      <PiClock className="w-5 h-5 text-dark" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dark/50 mb-1">
                        Time
                      </p>
                      <p className="text-dark font-medium">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                      <PiMapPin className="w-5 h-5 text-dark" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dark/50 mb-1">
                        Location
                      </p>
                      <p className="text-dark font-medium">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                      <PiTag className="w-5 h-5 text-dark" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dark/50 mb-1">
                        Category
                      </p>
                      <p className="text-dark font-medium">{event.category}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                    }
                  }}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold border border-dark/20 text-dark hover:bg-dark hover:text-white transition-all duration-300"
                >
                  <PiShareNetwork className="w-4 h-4" />
                  Share Event
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream pb-16">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2 btn-secondary"
            >
              <PiArrowLeft className="w-4 h-4" />
              View All Events
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
