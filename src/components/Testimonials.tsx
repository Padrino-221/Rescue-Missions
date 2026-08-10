'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiStarFill } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'

const defaultTestimonials = [
  {
    quote:
      'Supporting Rescue Mission has been one of the most rewarding experiences of my life. Seeing the direct impact on children is incredible.',
    author: 'Sarah Johnson',
    role: 'Monthly Donor',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
  {
    quote:
      'Volunteering here changed my perspective on life. The dedication of the team and the joy of the children is truly inspiring.',
    author: 'Michael Chen',
    role: 'Volunteer',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
  {
    quote:
      'As a corporate partner, we have seen firsthand how Rescue Mission transforms communities. Their transparency is unmatched.',
    author: 'Emily Rodriguez',
    role: 'Corporate Partner',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
]

export default function Testimonials() {
  const { settings } = useSettings()

  const testimonials = useMemo(() => {
    if (!settings?.testimonials?.length) return defaultTestimonials
    return settings.testimonials.map((t) => ({
      quote: t.quote || '',
      author: t.author || '',
      role: t.role || '',
      avatar: t.avatar || '',
      rating: (t as { rating?: number }).rating || 5,
    }))
  }, [settings])

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="kicker mb-6">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark">
              Voices of our community
            </h2>
          </div>
          <p className="text-dark/55 max-w-sm leading-relaxed">
            Donors, volunteers, and partners share what standing with us means to them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="flex flex-col"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <PiStarFill key={i} className="w-4 h-4 text-lime" />
                ))}
              </div>

              <blockquote className="text-dark/70 leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-8 pt-6 border-t border-dark/10 flex items-center gap-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-dark">{testimonial.author}</p>
                  <p className="text-dark/45 text-sm">{testimonial.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}