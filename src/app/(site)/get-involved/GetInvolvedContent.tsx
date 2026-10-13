'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiHeartFill, PiUsers, PiBuilding, PiCheck } from 'react-icons/pi'
import Image from 'next/image'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Link from 'next/link'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

export default function GetInvolvedPage({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const [activeTab, setActiveTab] = useState('volunteer')
  const { settings, loading } = useSettings(initialSettings)

  const volunteerRoles = settings?.volunteerRoles ?? []
  const sponsorship = settings?.sponsorship ?? null
  const corporate = settings?.corporate ?? null
  // Generic sponsorship needs (cars, gadgets, land, children, ...).
  // Older saves used `sponsoredChildren`; those are mapped forward so
  // nothing already published is lost.
  const sponsorshipNeeds = settings?.sponsorshipNeeds?.length
    ? settings.sponsorshipNeeds
    : (settings?.sponsoredChildren ?? []).map((c) => ({
        title: c.name || '',
        detail: [c.age ? `Age ${c.age}` : '', c.note || ''].filter(Boolean).join(' • '),
        amount: '',
        image: c.image || '',
      }))

  const gi = settings?.getInvolved
  const getInvolved = {
    kicker: gi?.kicker || '',
    heading: gi?.heading || '',
    description: gi?.description || '',
    volunteerHeading: gi?.volunteerHeading || '',
    volunteerDescription: gi?.volunteerDescription || '',
    sponsorHeading: gi?.sponsorHeading || '',
    sponsorDescription: gi?.sponsorDescription || '',
    corporateHeading: gi?.corporateHeading || '',
    corporateDescription: gi?.corporateDescription || '',
  }
  const hasHero = Boolean(getInvolved.kicker || getInvolved.heading || getInvolved.description)

  if (loading) return null

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
            {getInvolved.kicker && <span className="kicker mb-6">{getInvolved.kicker}</span>}
            {getInvolved.heading && (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              {getInvolved.heading}
            </h1>
            )}
            {getInvolved.description && (
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              {getInvolved.description}
            </p>
            )}
          </motion.div>
        </div>
      </section>
      )}

      {/* Ways to Get Involved */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: PiUsers, title: 'Volunteer', tab: 'volunteer' },
              { icon: PiHeartFill, title: 'Sponsor', tab: 'sponsor' },
              { icon: PiBuilding, title: 'Corporate', tab: 'corporate' },
            ].map((item, index) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveTab(item.tab)}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                  activeTab === item.tab
                    ? 'bg-dark text-white border border-dark'
                    : 'bg-white text-dark border border-dark/10 hover:border-dark/30'
                }`}
              >
                <item.icon className="w-8 h-8 mx-auto mb-3" />
                <span className="font-semibold">{item.title}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          {/* Volunteer Section */}
          {activeTab === 'volunteer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12"
            >
              <div>
                {getInvolved.volunteerHeading && <h2 className="text-3xl font-serif text-dark mb-6">{getInvolved.volunteerHeading}</h2>}
                {getInvolved.volunteerDescription && (
                <p className="text-dark/60 mb-8 leading-relaxed">
                  {getInvolved.volunteerDescription}
                </p>
                )}
                
                <div className="space-y-4">
                  {volunteerRoles.map((role) => (
                    <div key={role.title} className="card-premium p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-dark">{role.title}</h3>
                          <p className="text-dark/60 text-sm mt-1">{role.description}</p>
                        </div>
                        <span className="text-sm text-lime font-medium whitespace-nowrap">{role.commitment}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card-premium p-8">
                <h3 className="text-xl font-serif text-dark mb-6">Volunteer Application</h3>
                <form className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Your name"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <Select
                    label="Preferred Role"
                    placeholder="Select a role"
                    options={volunteerRoles.map((role) => ({ label: role.title, value: role.title }))}
                  />
                  <Textarea
                    label="Tell us about yourself"
                    rows={4}
                    placeholder="Share your experience and motivation..."
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Sponsor Section */}
          {activeTab === 'sponsor' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12"
            >
              <div>
                {getInvolved.sponsorHeading && <h2 className="text-3xl font-serif text-dark mb-6" id="sponsor">{getInvolved.sponsorHeading}</h2>}
                {getInvolved.sponsorDescription && (
                <p className="text-dark/60 mb-8 leading-relaxed">
                  {getInvolved.sponsorDescription}
                </p>
                )}
                
                {sponsorship && (
                <div className="card-premium p-6 mb-8">
                  <h3 className="font-semibold text-dark mb-4">Monthly Sponsorship: GH₵{sponsorship.monthlyAmount}/month</h3>
                  <ul className="space-y-3">
                    {(sponsorship.benefits ?? []).map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-dark/60 text-sm">
                        <PiCheck className="w-5 h-5 text-lime mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                )}
                
                <Link href="/contact" className="btn-lime w-full">
                  <PiHeartFill className="w-5 h-5" />
                  Start Sponsoring Today
                </Link>
              </div>
              
              <div className="card-premium p-8">
                <h3 className="text-xl font-serif text-dark mb-6">For Sponsorship</h3>
                <div className="space-y-4">
                  {sponsorshipNeeds.map((need, i) => (
                    <div key={need.title || `need-${i}`} className="flex items-center gap-4 p-4 bg-dark/5 rounded-2xl border border-dark/10">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-dark/10 flex-shrink-0">
                        {need.image ? (
                          <Image src={need.image} alt={need.title || 'Sponsorship need'} fill className="object-cover" sizes="64px" />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-dark">{need.title || `Item ${i + 1}`}</p>
                        {(need.detail || need.amount) && (
                        <p className="text-dark/60 text-sm">{[need.detail, need.amount].filter(Boolean).join(' • ')}</p>
                        )}
                      </div>
                      <Link href="/contact" className="text-dark font-semibold text-sm hover:text-dark-100">
                        Sponsor →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Corporate Section */}
          {activeTab === 'corporate' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-12"
            >
              <div>
                {getInvolved.corporateHeading && <h2 className="text-3xl font-serif text-dark mb-6" id="corporate">{getInvolved.corporateHeading}</h2>}
                {getInvolved.corporateDescription && (
                <p className="text-dark/60 mb-8 leading-relaxed">
                  {getInvolved.corporateDescription}
                </p>
                )}
                
                <div className="space-y-4">
                  {(corporate?.tiers ?? []).map((item) => (
                    <div key={item.tier} className="card-premium p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                          item.tier === 'Gold' ? 'bg-lime text-dark' : item.tier === 'Silver' ? 'bg-dark/60' : 'bg-dark/40'
                        }`}>
                          {item.tier[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-dark">{item.tier} Partner - {item.amount}</p>
                          <p className="text-dark/60 text-sm">{item.benefits}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card-premium p-8">
                <h3 className="text-xl font-serif text-dark mb-6">Partner Benefits</h3>
                <ul className="space-y-3">
                  {(corporate?.benefits ?? []).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-dark/60 text-sm">
                      <PiCheck className="w-5 h-5 text-lime mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <h4 className="font-semibold text-dark mb-4">Interested in Partnering?</h4>
                  <p className="text-dark/55 text-sm mb-5">Reach out to us and we&apos;ll get back to you with partnership details.</p>
                  <Link href="/contact" className="btn-primary w-full">
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
