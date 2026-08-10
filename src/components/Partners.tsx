'use client'

import { useState, useEffect } from 'react'

const defaultPartners = [
  { name: 'ZenZap' },
  { name: 'sparkle' },
  { name: 'Lum Labs' },
  { name: 'Pulse' },
  { name: 'swift' },
  { name: 'innovio' },
]

export default function Partners() {
  const [partners, setPartners] = useState(defaultPartners)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.partners?.length) setPartners(data.partners)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="py-16 bg-cream border-y border-dark/10">
      <div className="container-premium">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-dark/40 mb-8">
          Trusted by partners &amp; supporters worldwide
        </p>

        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-cream to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-cream to-transparent z-10" />

          <div className="flex animate-marquee whitespace-nowrap">
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex items-center justify-center mx-14 text-dark/30 hover:text-dark/70 transition-colors duration-300"
              >
                <span className="text-lg font-serif font-semibold tracking-tight">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}