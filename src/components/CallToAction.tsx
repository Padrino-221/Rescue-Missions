'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PiHeartFill, PiArrowUpRight } from 'react-icons/pi'

export default function CallToAction() {
  return (
    <section className="section-padding bg-cream overflow-hidden">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-dark rounded-[2.5rem] px-8 md:px-16 lg:px-24 py-20 md:py-28 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-coral/15 rounded-full blur-3xl" />

          <span className="kicker-light justify-center mb-8">Give Hope a Home</span>

          <h2 className="text-4xl md:text-6xl font-serif text-cream leading-[1.02] mx-auto max-w-3xl text-balance">
            Your kindness becomes a child&apos;s breakthrough
          </h2>

          <p className="mt-8 text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Every donation, every volunteer hour, every share — it all adds up to education,
            healthcare, and a safe home for a child in need.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-lime !px-8 !py-4 text-base group">
              <PiHeartFill className="w-5 h-5" />
              Donate Now
              <PiArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link href="/get-involved" className="btn-white group !px-8 !py-4 text-base">
              Volunteer
              <PiArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}