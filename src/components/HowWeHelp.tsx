'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { PiArrowRight, PiGraduationCap, PiHeartbeat, PiHouse, PiUsers } from 'react-icons/pi'
import Link from 'next/link'

const services = [
  {
    no: '01',
    icon: PiGraduationCap,
    title: 'Education Programs',
    description: 'Quality teaching, tutoring, and learning resources for every child in our care.',
  },
  {
    no: '02',
    icon: PiHeartbeat,
    title: 'Healthcare Support',
    description: 'Check-ups, vaccinations, and mental-health care that keep children thriving.',
  },
  {
    no: '03',
    icon: PiHouse,
    title: 'Safe Shelter',
    description: 'A warm, secure home where children feel safe enough to simply be kids.',
  },
]

const tags = ['Transparent', 'Emergency Relief', 'Led Action', 'Focused Aid', 'Donors Worldwide']

export default function HowWeHelp() {
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
            <span className="kicker mb-6">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05]">
              Driven by compassion, guided by humanity
            </h2>

            <div className="mt-10 relative">
              <div className="rounded-[2rem] overflow-hidden aspect-[4/3] relative">
                <Image
                  src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80"
                  alt="Caregivers spending time with children at the orphanage"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-2 bg-white rounded-full text-xs font-medium text-dark border border-dark/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - services */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:pt-24"
          >
            <h3 className="text-2xl md:text-3xl font-serif text-dark leading-snug">
              With compassion at our core, we deliver essential aid to children and
              families facing hardship.
            </h3>

            <p className="mt-6 text-dark/55 leading-relaxed">
              At our core, we believe giving is more than charity — it&apos;s a shared promise
              of humanity. That&apos;s why we go beyond short-term relief to deliver thoughtful,
              meaningful, and lasting impact in every community we serve.
            </p>

                        <div className="mt-12 divide-y-2 divide-dashed divide-dark/10">
              {services.map((service) => {
                const chip = 'bg-lime/20 text-dark'
                return (
                <motion.div
                  key={service.no}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="py-7 flex items-start gap-5 group"
                >
                  <span className="text-sm font-extrabold text-dark/30 pt-0.5">({service.no})</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${chip} flex items-center justify-center`}>
                        <service.icon className="w-5 h-5" />
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