'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { PiArrowRight, PiGraduationCap, PiHeartbeat, PiHouse, PiUsers } from 'react-icons/pi'
import Link from 'next/link'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

const iconMap: Record<string, typeof PiGraduationCap> = {
  'graduation-cap': PiGraduationCap,
  heart: PiHeartbeat,
  'heart-beat': PiHeartbeat,
  house: PiHouse,
  users: PiUsers,
}

export default function HowWeHelp({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const saved = settings?.howWeHelp
  if (loading) return null
  if (!saved) return null
  const howWeHelp = {
    kicker: saved.kicker || '',
    heading: saved.heading || '',
    description: saved.description || '',
    imageUrl: saved.imageUrl || '',
    imageAlt: saved.imageAlt || '',
    tags: saved.tags ?? [],
    services: saved.services ?? [],
  }
  if (!howWeHelp.kicker && !howWeHelp.heading && !howWeHelp.description && !howWeHelp.imageUrl && howWeHelp.tags.length === 0 && howWeHelp.services.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left - image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-28"
          >
            {howWeHelp.kicker && <span className="kicker mb-6">{howWeHelp.kicker}</span>}
            {howWeHelp.heading && (
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05]">
              {howWeHelp.heading}
            </h2>
            )}

            {howWeHelp.imageUrl && (
            <div className="mt-10 relative">
              <div className="rounded-[2rem] overflow-hidden aspect-[4/3] relative">
                <Image
                  src={howWeHelp.imageUrl}
                  alt={howWeHelp.imageAlt || ''}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-top"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {howWeHelp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-2 bg-white rounded-full text-xs font-medium text-dark border border-dark/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            )}
          </motion.div>

          {/* Right - services */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:pt-24"
          >
            {howWeHelp.description && (
            <h3 className="text-2xl md:text-3xl font-serif text-dark leading-snug">
              {howWeHelp.description}
            </h3>
            )}

            <p className="mt-6 text-dark/55 leading-relaxed">
              At our core, we believe giving is more than charity — it&apos;s a shared promise
              of humanity. That&apos;s why we go beyond short-term relief to deliver thoughtful,
              meaningful, and lasting impact in every community we serve.
            </p>

            <div className="mt-12 divide-y-2 divide-dashed divide-dark/10">
              {howWeHelp.services.map((service, index) => {
                const chip = 'bg-lime/20 text-dark'
                const num = String(index + 1).padStart(2, '0')
                return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="py-7 flex items-start gap-5 group"
                >
                  <span className="text-sm font-extrabold text-dark/30 pt-0.5">({num})</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${chip} flex items-center justify-center`}>
                        <PiGraduationCap className="w-5 h-5" />
                      </div>
                      <h4 className="text-lg font-serif text-dark">{service.title}</h4>
                    </div>
                    <p className="mt-2 text-dark/50 text-sm leading-relaxed pl-[3.25rem]">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
                )
              })}
            </div>

            <div className="mt-10">
              <p className="text-sm text-dark/45 mb-4 flex items-center gap-2">
                <PiUsers className="w-4 h-4" /> Ready to stand with us?
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="btn-primary group">
                  Learn More
                  <PiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about#team" className="btn-secondary group">
                  Our Team
                  <PiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
