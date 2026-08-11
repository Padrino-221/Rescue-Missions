'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiHeartFill, PiUsers, PiBuilding, PiCheck } from 'react-icons/pi'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Link from 'next/link'
import { useSettings } from '@/lib/useSettings'

const defaultVolunteerRoles = [
  { title: 'Teaching Assistant', commitment: '4 hours/week', description: 'Help children with their studies and homework.' },
  { title: 'Mentor', commitment: '2 hours/week', description: 'Guide and support a child through their journey.' },
  { title: 'Event Coordinator', commitment: 'Flexible', description: 'Help organize and run fundraising events.' },
  { title: 'Skilled Volunteer', commitment: 'Project-based', description: 'Share your professional skills (medical, legal, etc.).' },
]

const defaultSponsorship = {
  monthlyAmount: 50,
  benefits: [
    'Monthly updates and photos of your sponsored child',
    'Direct correspondence through letters',
    'Annual progress reports',
    'Invitation to visit (where possible)',
    'Tax-deductible donation receipt',
  ],
}

const defaultCorporate = {
  tiers: [
    { tier: 'Bronze', amount: 'GH₵5,000/year', benefits: 'Logo on website, social media mentions' },
    { tier: 'Silver', amount: 'GH₵15,000/year', benefits: 'All Bronze + event sponsorship, employee volunteer days' },
    { tier: 'Gold', amount: 'GH₵30,000/year', benefits: 'All Silver + naming rights, board observer seat' },
  ],
  benefits: [
    'Brand visibility on our website and events',
    'Employee engagement opportunities',
    'Tax benefits for corporate donations',
    'CSR reporting support',
    'Partnership certificates',
  ],
}

export default function GetInvolvedPage() {
  const [activeTab, setActiveTab] = useState('volunteer')
  const { settings } = useSettings()

  const volunteerRoles = settings?.volunteerRoles || defaultVolunteerRoles
  const sponsorship = settings?.sponsorship || defaultSponsorship
  const corporate = settings?.corporate || defaultCorporate

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-40 pb-6 lg:pt-48 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="kicker mb-6">Join Our Mission</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              Get Involved
            </h1>
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              There are many ways you can make a difference in the lives of orphaned
              children — find the one that fits you.
            </p>
          </motion.div>
        </div>
      </section>

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
                <h2 className="text-3xl font-serif text-dark mb-6">Volunteer With Us</h2>
                <p className="text-dark/60 mb-8 leading-relaxed">
                  Join our team of dedicated volunteers and make a direct impact on children&apos;s lives. 
                  Whether you have a few hours or a few weeks, there&apos;s a role for you.
                </p>
                
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
                <h2 className="text-3xl font-serif text-dark mb-6" id="sponsor">Sponsor a Child</h2>
                <p className="text-dark/60 mb-8 leading-relaxed">
                  Your sponsorship provides a child with consistent support for education, healthcare, 
                  and daily needs. Build a meaningful connection while changing a life.
                </p>
                
                <div className="card-premium p-6 mb-8">
                  <h3 className="font-semibold text-dark mb-4">Monthly Sponsorship: GH₵{sponsorship.monthlyAmount}/month</h3>
                  <ul className="space-y-3">
                    {sponsorship.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-dark/60 text-sm">
                        <PiCheck className="w-5 h-5 text-lime mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href="/contact" className="btn-lime w-full">
                  <PiHeartFill className="w-5 h-5" />
                  Start Sponsoring Today
                </Link>
              </div>
              
              <div className="card-premium p-8">
                <h3 className="text-xl font-serif text-dark mb-6">Children Awaiting Sponsors</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-dark/5 rounded-2xl border border-dark/10">
                      <div className="w-16 h-16 bg-dark/10 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-dark">Child {i}</p>
                        <p className="text-dark/60 text-sm">Age {6 + i} • Needs sponsorship</p>
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
                <h2 className="text-3xl font-serif text-dark mb-6" id="corporate">Corporate Partnerships</h2>
                <p className="text-dark/60 mb-8 leading-relaxed">
                  Partner with us to make a meaningful impact while enhancing your corporate social 
                  responsibility profile. We offer flexible partnership options tailored to your goals.
                </p>
                
                <div className="space-y-4">
                  {corporate.tiers.map((item) => (
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
                  {corporate.benefits.map((benefit) => (
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
