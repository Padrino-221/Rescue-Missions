'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiArrowRight } from 'react-icons/pi'

const progressBars = [
  { label: 'Education', percentage: 98, color: 'bg-coral' },
  { label: 'Healthcare', percentage: 75, color: 'bg-sky' },
  { label: 'Safe Shelter', percentage: 86, color: 'bg-mint' },
]

export default function FeaturedStory() {
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
                src="https://images.unsplash.com/photo-1543338759-8a08e2dbeec9?auto=format&fit=crop&w=1000&q=80"
                alt="Children in a classroom at the orphanage"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Floating quote */}
            <div className="absolute -bottom-8 -right-4 lg:right-0 bg-white rounded-2xl p-7 border border-dark/10 max-w-xs">
              <span className="block text-5xl font-serif leading-none text-lime">&ldquo;</span>
              <p className="text-dark/60 italic text-sm leading-relaxed">
                This place is amazing! Everything about this organization is pleasant. If
                you want someone to deliver real impact, this is it.
              </p>
              <div className="mt-5 pt-4 border-t border-dark/10 flex items-center gap-3">
                <Image
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=80&q=80"
                  alt="Grace Mwangi"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-dark text-sm">Grace Mwangi</p>
                  <p className="text-dark/45 text-xs">Program Director</p>
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
            <span className="kicker mb-6">A Gift of $36</span>
            <h2 className="text-4xl md:text-5xl font-serif text-dark leading-[1.05]">
              A steady hand changes everything
            </h2>
            <p className="mt-6 text-dark/55 leading-relaxed">
              Children in poverty deserve more than a second chance. They deserve access to
              life-changing benefits — medical care, educational support, life skills, and
              job training — before they graduate into adulthood.
            </p>

            <div className="mt-10 space-y-7">
              {progressBars.map((bar) => (
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