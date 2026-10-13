'use client'

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

const iconList = [PiBuildings, PiHandshake, PiBookOpen]

export default function ProgramsOverview({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const data = settings?.exploreOurWork ?? null

  if (loading) return null
  if (!data) return null
  if (!data.items?.length && !data.kicker && !data.heading && !data.description) return null

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
                key={item.index || item.title || `explore-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link href={item.href || '#'} className="block group h-full">
                  <div className="card-premium overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-dark/5">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={`${item.title} — Rescue Mission Orphanage`}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
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
