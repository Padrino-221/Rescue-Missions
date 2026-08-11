'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiArrowUpRight, PiBuildings, PiHandshake, PiBookOpen } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  PiBuildings,
  PiHandshake,
  PiBookOpen,
}

const defaultExploreOurWork = {
  kicker: 'Explore Our Work',
  heading: 'Three paths into our mission',
  description: 'Start where you feel most moved — learn who we are, give your time, or follow the journeys of children we serve.',
  items: [
    {
      index: '01',
      title: 'Who We Are',
      subtitle: 'Our Organization',
      description: 'Learn about our mission, our values, and the communities we serve.',
      href: '/about',
      imageUrl: 'https://images.unsplash.com/photo-1497486751826-5bc8bce4f3f6?auto=format&fit=crop&w=900&q=80',
    },
    {
      index: '02',
      title: 'Volunteers',
      subtitle: 'Take Action',
      description: 'Join our team of dedicated volunteers making a difference on the ground.',
      href: '/get-involved',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    },
    {
      index: '03',
      title: 'Stories',
      subtitle: 'Building A Future',
      description: 'Read inspiring stories of hope, resilience, and transformation.',
      href: '/stories',
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',
    },
  ],
}

const iconList = [PiBuildings, PiHandshake, PiBookOpen]

export default function ProgramsOverview({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const data = useMemo(() => {
    if (settings?.exploreOurWork) return settings.exploreOurWork
    return defaultExploreOurWork
  }, [settings])

  if (loading) return null

  return (
    <section className="section-padding bg-cream">
      <div className="container-premium">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="kicker mb-6">{data.kicker}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark max-w-lg">
              {data.heading}
            </h2>
          </div>
          <p className="text-dark/55 max-w-sm leading-relaxed">
            {data.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data.items.map((item, i) => {
            const Icon = iconList[i % iconList.length]
            return (
              <motion.div
                key={item.index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href={item.href} className="block group h-full">
                  <div className="card-premium overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={`${item.title} — Rescue Mission Orphanage`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-lime/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-dark/45 font-medium">{item.subtitle}</p>
                          <h3 className="text-2xl font-serif text-dark group-hover:text-dark-100 transition-colors">{item.title}</h3>
                        </div>
                      </div>
                      <p className="mt-3 text-dark/55 leading-relaxed flex-1">{item.description}</p>

                      <div className="mt-8 pt-5 border-t-2 border-dashed border-dark/10 flex items-center gap-2 text-dark font-semibold text-sm group-hover:gap-3.5 transition-all">
                        Learn More
                        <PiArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
