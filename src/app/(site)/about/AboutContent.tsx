'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { PiHeartFill, PiEye, PiShieldCheck, PiGlobe, PiUsers, PiArrowRight, PiHandHeart } from 'react-icons/pi'
import Link from 'next/link'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

const defaultValues = [
  { icon: PiHeartFill, title: 'Compassion', description: 'Empathy at the heart of everything we do.' },
  { icon: PiShieldCheck, title: 'Integrity', description: 'Transparency and accountability in all operations.' },
  { icon: PiGlobe, title: 'Impact', description: 'Sustainable solutions creating lasting change.' },
  { icon: PiUsers, title: 'Collaboration', description: 'Partnerships amplifying our collective impact.' },
]

const defaultTeam = [
  { name: 'Grace Mwangi', role: 'Executive Director', bio: '20+ years in nonprofit leadership', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80' },
  { name: 'David Okonkwo', role: 'Programs Director', bio: 'Expert in child development programs', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sarah Williams', role: 'Development Manager', bio: 'Passionate about community engagement', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
  { name: 'James Chen', role: 'Finance Director', bio: 'Ensuring transparent financial stewardship', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
]

const defaultMilestones = [
  { year: '2008', title: 'Founded', description: 'Established with a vision to help orphaned children.' },
  { year: '2012', title: 'First 100 Children', description: 'Reached milestone of supporting 100 children.' },
  { year: '2016', title: 'New Facility', description: 'Opened a new facility to serve more children.' },
  { year: '2020', title: 'Global Expansion', description: 'Extended reach to 5 countries in Africa and Asia.' },
  { year: '2024', title: '5,000+ Children', description: 'Celebrated supporting over 5,000 children.' },
]

const iconMap: Record<string, typeof PiHeartFill> = {
  Compassion: PiHeartFill,
  Integrity: PiShieldCheck,
  Impact: PiGlobe,
  Collaboration: PiUsers,
}

const defaultStory = {
  storyHeading: 'A Journey of Hope Since 2008',
  storyParagraphs: [
    'Rescue Mission Orphanage was founded with a simple yet powerful vision: to provide every orphaned child with the opportunity to grow, learn, and thrive in a safe and nurturing environment.',
    'What started as a small shelter for 10 children has grown into a comprehensive organization serving thousands of children across multiple countries.',
    'Today, we continue to expand our reach and deepen our impact, guided by the belief that every child deserves a chance at a brighter future.',
  ],
  missionStatement: 'To provide comprehensive care, education, and support to orphaned and vulnerable children, empowering them to become self-reliant, compassionate, and productive members of society.',
  visionStatement: 'A world where every orphaned child has access to quality education, healthcare, and the opportunity to realize their full potential in a loving and supportive environment.',
}

const defaultStoryImage =
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80'

export default function AboutPage({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const about = settings?.about
  const storyHeading = about?.storyHeading || defaultStory.storyHeading
  const storyParagraphs = about?.storyParagraphs?.length ? about.storyParagraphs : defaultStory.storyParagraphs
  const missionStatement = about?.missionStatement || defaultStory.missionStatement
  const visionStatement = about?.visionStatement || defaultStory.visionStatement
  const storyImageUrl = about?.storyImageUrl || defaultStoryImage
  const foundedYear = settings?.general?.foundedYear || '2008'
  const values = about?.values?.length
    ? about.values.map((v) => ({ icon: iconMap[v.title] || PiHeartFill, title: v.title, description: v.description }))
    : defaultValues
  const team = about?.team?.length ? about.team : defaultTeam
  const milestones = about?.milestones?.length ? about.milestones : defaultMilestones

  if (loading) return null

  return (
    <>
      {/* Hero */}
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
            <span className="kicker mb-5">About Us</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              Our Story
            </h1>
            <p className="mt-5 text-lg text-dark/55 max-w-xl leading-relaxed">
              A journey of hope, dedication, and transformation in the lives of
              orphaned children since {foundedYear}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
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
              <h2 className="mt-3 text-3xl md:text-4xl font-serif text-dark">
                {storyHeading}
              </h2>
              <div className="mt-6 space-y-3 text-dark/55 text-[15px] leading-relaxed">
                {storyParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
            
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
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="section-padding bg-white">
        <div className="container-premium">
          <div className="text-center mb-8">
            <span className="pill-tag mb-5 inline-block">What Drives Us</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-dark">
              Mission &amp; Vision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
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
          </div>
        </div>
      </section>

      {/* Values */}
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
                key={value.title}
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

      {/* Team */}
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
                key={member.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="card-premium overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-dark">{member.name}</h3>
                  <p className="text-lime text-sm font-medium">{member.role}</p>
                  <p className="mt-1.5 text-dark/50 text-xs">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
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
                  key={m.year}
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
                  key={m.year}
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
