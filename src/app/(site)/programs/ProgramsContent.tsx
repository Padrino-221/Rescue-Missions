'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiArrowRight } from 'react-icons/pi'
import { programIcons } from '@/lib/programIcons'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

export default function ProgramsContent({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const saved = settings?.programs
  if (loading) return null
  if (!saved) return null
  const programsData = {
    kicker: saved.kicker || '',
    heading: saved.heading || '',
    description: saved.description || '',
    ctaHeading: saved.ctaHeading || '',
    ctaDescription: saved.ctaDescription || '',
    items: saved.items ?? [],
  }
  if (!programsData.kicker && !programsData.heading && !programsData.description && programsData.items.length === 0) return null
  const hasHero = Boolean(programsData.kicker || programsData.heading || programsData.description)
  const hasCta = Boolean(programsData.ctaHeading || programsData.ctaDescription)

  return (
    <>
{/* Hero */}
      {hasHero && (
      <section className="bg-cream pt-24 pb-6 lg:pt-28 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {programsData.kicker && <span className="kicker mb-6">{programsData.kicker}</span>}
            {programsData.heading && (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              {programsData.heading}
            </h1>
            )}
            {programsData.description && (
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              {programsData.description}
            </p>
            )}
          </motion.div>
        </div>
      </section>
      )}

      {/* Programs Overview */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="space-y-12 lg:space-y-20">
            {programsData.items.map((program, index) => {
              const Icon = programIcons[program.icon] ?? programIcons.heart
              return (
              <motion.div
                key={program.id || program.title || `program-${index}`}
                id={program.id || undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-lime" />
                    </div>
                    <div>
                      <span className="text-dark/50 text-sm font-medium">{program.subtitle}</span>
                      <h2 className="text-3xl md:text-4xl font-serif text-dark">{program.title}</h2>
                    </div>
                  </div>
                  <p className="mt-6 text-dark/60 leading-relaxed">{program.description}</p>

                  <div className="mt-8">
                    <h4 className="font-semibold text-dark mb-4">Key Activities:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(program.features ?? []).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-dark/60 text-sm">
                          <span className="w-2 h-2 bg-lime rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-6">
                    {Object.entries(program.impact ?? {}).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-2xl font-serif text-dark font-semibold">{value}</p>
                        <p className="text-dark/50 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] h-full bg-dark/5">
                    {program.image && (
                      <Image
                        src={program.image}
                        alt={`${program.title} program`}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      {hasCta && (
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="bg-dark rounded-[2.5rem] px-8 md:px-16 py-16 md:py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
            {programsData.ctaHeading && <h2 className="text-3xl md:text-4xl font-serif text-cream">{programsData.ctaHeading}</h2>}
            {programsData.ctaDescription && <p className="mt-3 text-cream/50 max-w-lg mx-auto">{programsData.ctaDescription}</p>}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-lime">
                Contact Us
                <PiArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/get-involved" className="btn-secondary !border-white/30 !text-white hover:!bg-white hover:!text-dark">
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  )
}
