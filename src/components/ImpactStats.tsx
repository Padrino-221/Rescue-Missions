'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PiGraduationCap, PiUsers, PiMapPin, PiCurrencyCircleDollar } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'

const iconMap = [PiGraduationCap, PiUsers, PiMapPin, PiCurrencyCircleDollar]

const defaultStats = [
  { value: '2,500+', label: 'Children Educated', description: 'Through our learning programs' },
  { value: '500+', label: 'Families Supported', description: 'With emergency relief' },
  { value: '15+', label: 'Communities', description: 'Across multiple regions' },
  { value: 'GH₵2.5M', label: 'Funds Raised', description: 'From generous donors' },
]

export default function ImpactStats() {
  const [stats, setStats] = useState(defaultStats)
  const [kicker, setKicker] = useState('Our Impact')
  const [heading, setHeading] = useState('Making a Real Difference')
  const [description, setDescription] = useState(
    'Measurable, lasting change — from classrooms to clinics, every program is built to lift children out of hardship.'
  )
  const { settings } = useSettings()

  useEffect(() => {
    const impact = settings?.impactStats
    if (!impact) return

    if (impact.kicker) setKicker(impact.kicker)
    if (impact.heading) setHeading(impact.heading)
    if (impact.description) setDescription(impact.description)
    if (impact.stats && impact.stats.length > 0) {
      setStats(
        impact.stats.map((s) => ({
          value: s.value,
          label: s.label,
          description: s.description,
        }))
      )
    }
  }, [settings])

  return (
    <section className="bg-dark section-padding relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-coral/20 rounded-full blur-3xl" />

      <div className="container-premium relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="kicker-light mb-6">{kicker}</span>
            <h2 className="text-4xl md:text-5xl font-serif text-cream">
              {heading}
            </h2>
          </div>
          <p className="text-cream/55 max-w-sm lg:text-right leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = iconMap[index] || PiGraduationCap
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 rounded-[2rem] p-6 sm:p-8 text-center border-2 border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-7 h-7 text-lime" />
                </div>
                <p className="text-4xl font-serif text-lime font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-3 text-cream font-bold">{stat.label}</p>
                <p className="mt-1 text-cream/45 text-sm">{stat.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
