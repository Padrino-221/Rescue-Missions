'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiStarFill } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

export default function Testimonials({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const t = settings?.testimonials
  if (loading) return null
  if (!t) return null
  const sectionKicker = t.kicker || ''
  const sectionHeading = t.heading || ''
  const sectionDescription = t.description || ''
  const testimonials = (t.items ?? []).map((item) => ({
    quote: item.quote || '',
    author: item.author || '',
    role: item.role || '',
    avatar: item.avatar || '',
    rating: (item as { rating?: number }).rating || 5,
  }))
  if (!sectionKicker && !sectionHeading && !sectionDescription && testimonials.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            {sectionKicker && <span className="kicker mb-6">{sectionKicker}</span>}
            {sectionHeading && (
            <h2 className="text-4xl md:text-5xl font-serif text-dark">
              {sectionHeading}
            </h2>
            )}
          </div>
          {sectionDescription && (
          <p className="text-dark/55 max-w-sm leading-relaxed">
            {sectionDescription}
          </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.author || `testimonial-${index}`}
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
                {testimonial.avatar && (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                )}
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