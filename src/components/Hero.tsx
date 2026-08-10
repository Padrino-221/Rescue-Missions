'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiArrowRight, PiHeartFill, PiSun } from 'react-icons/pi'

export default function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="absolute top-24 left-10 w-72 h-72 bg-sky/25 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-coral/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-lime/25 rounded-full blur-3xl" />

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
              Every child deserves a{' '}
              <span className="relative inline-block">
                childhood.
                <span className="absolute -bottom-1 left-0 right-0 h-4 bg-lime/70 -z-10 -skew-x-6 rounded-full" />
              </span>
            </h1>

            <p className="mt-8 text-lg text-dark/60 max-w-lg leading-relaxed">
              Rescue Mission Orphanage provides shelter, education, and care to children who
              need it most — turning hardship into hope, one child at a time.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
              <Link href="/donate" className="btn-lime !px-6 !py-3 sm:!px-8 sm:!py-4 text-sm sm:text-base group">
                <PiHeartFill className="w-4 h-4 sm:w-5 sm:h-5" />
                Donate Now
                <PiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/programs" className="btn-secondary !px-6 !py-3 sm:!px-8 sm:!py-4 text-sm sm:text-base group">
                Explore Our Work
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
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                  alt="Children playing at Rescue Mission Orphanage"
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
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
