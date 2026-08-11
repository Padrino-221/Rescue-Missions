'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiArrowRight, PiHeartFill, PiSun } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

interface HeroSettings {
  heading: string
  description: string
  cta1Text: string
  cta2Text: string
  imageUrl: string
  imageAlt: string
}

const defaults: HeroSettings = {
  heading: 'Every child deserves a childhood.',
  description:
    'Rescue Mission Orphanage provides shelter, education, and care to children who need it most — turning hardship into hope, one child at a time.',
  cta1Text: 'Contact Us',
  cta2Text: 'Explore Our Work',
  imageUrl:
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
  imageAlt: 'Children playing at Rescue Mission Orphanage',
}

export default function Hero({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const hero = useMemo((): HeroSettings => {
    const h = settings?.homeHero
    if (!h) return defaults
    return {
      heading: h.heading || defaults.heading,
      description: h.description || defaults.description,
      cta1Text: h.cta1Text || defaults.cta1Text,
      cta2Text: h.cta2Text || defaults.cta2Text,
      imageUrl: h.imageUrl || defaults.imageUrl,
      imageAlt: h.imageAlt || defaults.imageAlt,
    }
  }, [settings])

  if (loading) return null

  const [firstPart, lastWord] = splitHeading(hero.heading)

  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="absolute top-24 left-10 w-72 h-72 bg-sky/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-coral/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-lime/25 rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium pt-36 lg:pt-44 pb-12 lg:pb-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.5rem] font-serif text-dark leading-[0.88]">
              {firstPart}{' '}
              <span className="relative inline-block">
                {lastWord}
                <span className="absolute -bottom-1 left-0 right-0 h-4 bg-lime/70 -z-10 -skew-x-6 rounded-full" />
              </span>
            </h1>

            <p className="mt-8 text-lg text-dark/60 max-w-lg leading-relaxed">
              {hero.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
              <Link href="/contact" className="btn-lime !px-6 !py-3 sm:!px-8 sm:!py-4 text-sm sm:text-base group">
                <PiHeartFill className="w-4 h-4 sm:w-5 sm:h-5" />
                {hero.cta1Text}
                <PiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/programs" className="btn-secondary !px-6 !py-3 sm:!px-8 sm:!py-4 text-sm sm:text-base group">
                {hero.cta2Text}
                <PiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right content - image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-[3rem] bg-coral rotate-2" />
              <div className="absolute -inset-3 rounded-[3rem] bg-lime -rotate-3 translate-x-4 translate-y-4" />
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] border-4 border-cream">
                <Image
                  src={hero.imageUrl}
                  alt={hero.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Sun sticker */}
              <div className="absolute -top-5 -right-3 sm:-right-5 w-14 h-14 bg-lime rounded-full flex items-center justify-center rotate-12 border-2 border-lime-600">
                <PiSun className="w-7 h-7 text-dark" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function splitHeading(heading: string): [string, string] {
  const words = heading.trim().split(/\s+/)
  if (words.length <= 1) return ['', heading]
  const lastWord = words.pop()!
  return [words.join(' '), lastWord]
}
