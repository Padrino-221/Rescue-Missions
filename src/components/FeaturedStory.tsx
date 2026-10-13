'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiArrowRight } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

export default function FeaturedStory({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const fs = settings?.featuredStory
  if (loading) return null
  if (!fs) return null
  const featured = {
    kicker: fs.kicker || '',
    heading: fs.heading || '',
    description: fs.description || '',
    imageUrl: fs.imageUrl || '',
    imageAlt: fs.imageAlt || '',
    progressBars: fs.progressBars ?? [],
    quote: fs.quote || '',
    quoteAuthor: fs.quoteAuthor || '',
    quoteRole: fs.quoteRole || '',
    quoteAvatar: fs.quoteAvatar || '',
  }
  if (!featured.kicker && !featured.heading && !featured.description && !featured.imageUrl && !featured.quote && featured.progressBars.length === 0) return null

  return (
    <section className="section-padding bg-cream">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {featured.imageUrl && (
            <div className="rounded-[2rem] overflow-hidden aspect-[4/3] relative">
              <Image
                src={featured.imageUrl}
                alt={featured.imageAlt || ''}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            )}

            {/* Floating quote */}
            {featured.quote && (
            <div className="absolute -bottom-8 -right-4 lg:right-0 bg-white rounded-2xl p-7 border border-dark/10 max-w-xs">
              <span className="block text-5xl font-serif leading-none text-lime">&ldquo;</span>
              <p className="text-dark/60 italic text-sm leading-relaxed">
                {featured.quote}
              </p>
              <div className="mt-5 pt-4 border-t border-dark/10 flex items-center gap-3">
                {featured.quoteAvatar && (
                <Image
                  src={featured.quoteAvatar}
                  alt={featured.quoteAuthor || ''}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                )}
                <div>
                  <p className="font-semibold text-dark text-sm">{featured.quoteAuthor}</p>
                  <p className="text-dark/45 text-xs">{featured.quoteRole}</p>
                </div>
              </div>
            </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {featured.kicker && <span className="kicker mb-6">{featured.kicker}</span>}
            {featured.heading && (
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05]">
              {featured.heading}
            </h2>
            )}
            {featured.description && (
            <p className="mt-6 text-dark/55 leading-relaxed">
              {featured.description}
            </p>
            )}

            <div className="mt-10 space-y-7">
              {featured.progressBars.map((bar, i) => (
                <div key={bar.label || `bar-${i}`}>
                  <div className="flex justify-between mb-2.5">
                    <span className="font-medium text-dark text-sm">{bar.label}</span>
                    <span className="font-semibold text-dark text-sm">{bar.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-dark/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className={`h-full ${bar.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="mt-10 btn-primary group inline-flex">
              About Us
              <PiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
