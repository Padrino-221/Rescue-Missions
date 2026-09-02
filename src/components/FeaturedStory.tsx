'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiArrowRight } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

const defaultFeaturedStory = {
  kicker: 'A Gift of GH\u20B936',
  heading: 'A steady hand changes everything',
  description: 'Children in poverty deserve more than a second chance. They deserve access to life-changing benefits \u2014 medical care, educational support, life skills, and job training \u2014 before they graduate into adulthood.',
  imageUrl: 'https://images.unsplash.com/photo-1543338759-8a08e2dbeec9?auto=format&fit=crop&w=1000&q=80',
  imageAlt: 'Children in a classroom at the orphanage',
  progressBars: [
    { label: 'Education', percentage: 98, color: 'bg-coral' },
    { label: 'Healthcare', percentage: 75, color: 'bg-sky' },
    { label: 'Safe Shelter', percentage: 86, color: 'bg-mint' },
  ],
  quote: 'This place is amazing! Everything about this organization is pleasant. If you want someone to deliver real impact, this is it.',
  quoteAuthor: 'Grace Mwangi',
  quoteRole: 'Program Director',
  quoteAvatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=80&q=80',
}

export default function FeaturedStory({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const featured = useMemo(() => {
    if (!settings?.featuredStory) return defaultFeaturedStory
    const fs = settings.featuredStory
    return {
      kicker: fs.kicker || defaultFeaturedStory.kicker,
      heading: fs.heading || defaultFeaturedStory.heading,
      description: fs.description || defaultFeaturedStory.description,
      imageUrl: fs.imageUrl || defaultFeaturedStory.imageUrl,
      imageAlt: fs.imageAlt || defaultFeaturedStory.imageAlt,
      progressBars: fs.progressBars?.length ? fs.progressBars : defaultFeaturedStory.progressBars,
      quote: fs.quote || defaultFeaturedStory.quote,
      quoteAuthor: fs.quoteAuthor || defaultFeaturedStory.quoteAuthor,
      quoteRole: fs.quoteRole || defaultFeaturedStory.quoteRole,
      quoteAvatar: fs.quoteAvatar || defaultFeaturedStory.quoteAvatar,
    }
  }, [settings])

  if (loading) return null

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
            <div className="rounded-[2rem] overflow-hidden aspect-[4/3] relative">
              <Image
                src={featured.imageUrl}
                alt={featured.imageAlt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-top"
              />
            </div>

            {/* Floating quote */}
            <div className="absolute -bottom-8 -right-4 lg:right-0 bg-white rounded-2xl p-7 border border-dark/10 max-w-xs">
              <span className="block text-5xl font-serif leading-none text-lime">&ldquo;</span>
              <p className="text-dark/60 italic text-sm leading-relaxed">
                {featured.quote}
              </p>
              <div className="mt-5 pt-4 border-t border-dark/10 flex items-center gap-3">
                <Image
                  src={featured.quoteAvatar}
                  alt={featured.quoteAuthor}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-dark text-sm">{featured.quoteAuthor}</p>
                  <p className="text-dark/45 text-xs">{featured.quoteRole}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="kicker mb-6">{featured.kicker}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05]">
              {featured.heading}
            </h2>
            <p className="mt-6 text-dark/55 leading-relaxed">
              {featured.description}
            </p>

            <div className="mt-10 space-y-7">
              {featured.progressBars.map((bar) => (
                <div key={bar.label}>
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
