'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { PiHeartFill, PiEye, PiShieldCheck, PiGlobe, PiUsers, PiArrowRight, PiHandHeart } from 'react-icons/pi'
import Link from 'next/link'
import { useSettings } from '@/lib/useSettings'
import { resolveTeam, teamSlug } from '@/lib/team'
import type { SiteSettings } from '@/lib/settings'

const iconMap: Record<string, typeof PiHeartFill> = {
  Compassion: PiHeartFill,
  Integrity: PiShieldCheck,
  Impact: PiGlobe,
  Collaboration: PiUsers,
}

export default function AboutPage({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const about = settings?.about
  const storyHeading = about?.storyHeading || ''
  const storyParagraphs = about?.storyParagraphs ?? []
  const missionStatement = about?.missionStatement || ''
  const visionStatement = about?.visionStatement || ''
  const storyImageUrl = about?.storyImageUrl || ''
  const foundedYear = settings?.general?.foundedYear || ''
  const values = (about?.values ?? []).map((v) => ({ icon: iconMap[v.title] || PiHeartFill, title: v.title, description: v.description }))
  const team = resolveTeam(about?.team)
  const milestones = about?.milestones ?? []
  const hasHero = Boolean(about?.kicker || about?.heading || about?.heroDescription)
  const hasStory = Boolean(storyHeading || storyParagraphs.length || storyImageUrl)
  const hasMissionVision = Boolean(missionStatement || visionStatement)

  if (loading) return null
  if (!about) return null

  return (
    <>
      {/* Hero */}
      {hasHero && (
      <section className="bg-cream pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-72 h-72 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {about?.kicker && <span className="kicker mb-5">{about.kicker}</span>}
            {about?.heading && (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              {about.heading}
            </h1>
            )}
            {(about?.heroDescription || foundedYear) && (
            <p className="mt-5 text-lg text-dark/55 max-w-xl leading-relaxed">
              {about?.heroDescription}{about?.heroDescription && foundedYear ? ` ${foundedYear}.` : foundedYear}
            </p>
            )}
          </motion.div>
        </div>
      </section>
      )}

      {/* Our Story */}
      {hasStory && (
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="pill-tag mb-5 inline-block">Our Story</span>
              {storyHeading && (
              <h2 className="mt-3 text-3xl md:text-4xl font-serif text-dark">
                {storyHeading}
              </h2>
              )}
              <div className="mt-6 space-y-3 text-dark/55 text-[15px] leading-relaxed">
                {storyParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {storyImageUrl && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -inset-3 bg-coral/15 rounded-[2.5rem] -rotate-2" />
              <div className="absolute -inset-3 bg-lime/20 rounded-[2.5rem] rotate-1" />
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] border-2 border-white">
                <Image
                  src={storyImageUrl}
                  alt="Children at the orphanage"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Mission & Vision */}
      {hasMissionVision && (
      <section id="mission" className="section-padding bg-white">
        <div className="container-premium">
          <div className="text-center mb-8">
            <span className="pill-tag mb-5 inline-block">What Drives Us</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-dark">
              Mission &amp; Vision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {missionStatement && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-premium p-8 border-l-4 border-l-lime"
            >
              <div className="w-12 h-12 bg-lime/20 rounded-xl flex items-center justify-center mb-5">
                <PiEye className="w-6 h-6 text-dark" />
              </div>
              <h3 className="text-xl font-serif text-dark">Our Mission</h3>
              <p className="mt-3 text-dark/55 text-[15px] leading-relaxed">
                {missionStatement}
              </p>
            </motion.div>
            )}

            {visionStatement && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card-premium p-8 border-l-4 border-l-lime"
            >
              <div className="w-12 h-12 bg-lime/20 rounded-xl flex items-center justify-center mb-5">
                <PiGlobe className="w-6 h-6 text-dark" />
              </div>
              <h3 className="text-xl font-serif text-dark">Our Vision</h3>
              <p className="mt-3 text-dark/55 text-[15px] leading-relaxed">
                {visionStatement}
              </p>
            </motion.div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Values */}
      {values.length > 0 && (
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="text-center mb-8">
            <span className="pill-tag mb-5 inline-block">Our Values</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-dark">
              What We Stand For
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title ? `${value.title}-${index}` : `value-${index}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="card-premium p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-lime/20 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-dark" />
                </div>
                <h3 className="text-lg font-serif text-dark">{value.title}</h3>
                <p className="mt-2 text-dark/50 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Team */}
      {team.length > 0 && (
      <section id="team" className="section-padding bg-white">
        <div className="container-premium">
          <div className="text-center mb-8">
            <span className="pill-tag mb-5 inline-block">Our Team</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-dark">
              Leadership
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name || `member-${index}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
              <Link
                href={`/about/leadership/${teamSlug(member.name, index)}`}
                className="card-premium overflow-hidden group block"
              >
                <div className="relative h-48 overflow-hidden bg-dark/5">
                  {member.avatar && (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-dark group-hover:text-dark-100 transition-colors">{member.name}</h3>
                  <p className="text-lime text-sm font-medium">{member.role}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-dark">
                    View profile
                    <PiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Timeline */}
      {milestones.length > 0 && (
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="text-center mb-8">
            <span className="pill-tag mb-5 inline-block">Our Journey</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-dark">
              Milestones
            </h2>
          </div>
          
          {/* Desktop horizontal */}
          <div className="hidden md:block relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-dark/10" />
            <div className="grid grid-cols-5 gap-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={`${m.year}-${m.title}-${i}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative pt-10 text-center"
                >
                  <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-lime border-4 border-cream z-10" />
                  <span className="text-2xl font-serif font-bold text-dark">{m.year}</span>
                  <h3 className="mt-1.5 text-sm font-semibold text-dark">{m.title}</h3>
                  <p className="mt-1 text-xs text-dark/50 leading-relaxed">{m.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile vertical */}
          <div className="md:hidden relative pl-8">
            <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-dark/10" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={`m-${m.year}-${m.title}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative"
                >
                  <div className="absolute -left-8 top-1 w-5 h-5 rounded-full bg-lime border-4 border-cream z-10" />
                  <div className="card-premium p-5">
                    <span className="text-xl font-serif font-bold text-dark">{m.year}</span>
                    <h3 className="mt-1 text-sm font-semibold text-dark">{m.title}</h3>
                    <p className="mt-1 text-xs text-dark/50">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="bg-dark rounded-[2.5rem] px-8 md:px-16 py-16 md:py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
            <PiHandHeart className="w-10 h-10 text-lime mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-serif text-cream">Want to Support Our Mission?</h2>
            <p className="mt-3 text-cream/50 max-w-lg mx-auto">Contact us to learn how you can support our mission.</p>
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
    </>
  )
}
