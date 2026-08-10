'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiHeartFill, PiCheck, PiShieldCheck, PiBook, PiBowlFood, PiPill, PiHouse, PiGraduationCap, PiGift } from 'react-icons/pi'

const donationAmounts = [
  { amount: 25, impact: 'School supplies for a month', icon: PiBook },
  { amount: 50, impact: 'Nutritious meals for a week', icon: PiBowlFood },
  { amount: 100, impact: 'Medical care checkup', icon: PiPill },
  { amount: 250, impact: 'Safe shelter for a month', icon: PiHouse },
  { amount: 500, impact: 'Education for a year', icon: PiGraduationCap },
  { amount: 1000, impact: 'Complete care package', icon: PiGift },
]

const donationTypes = [
  { id: 'one-time', label: 'One-Time Donation' },
  { id: 'monthly', label: 'Monthly Giving' },
  { id: 'sponsor', label: 'Sponsor a Child' },
]

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [customAmount, setCustomAmount] = useState('')
  const [donationType, setDonationType] = useState('one-time')

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
            <span className="kicker mb-6">Make a Difference</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              Donate Now
            </h1>
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              Your generosity can transform a child&apos;s life. Every donation makes a
              real impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Donation Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="card-premium p-8">
                <h2 className="text-2xl font-serif text-dark mb-6">Choose Your Donation</h2>
                
                {/* Donation Type */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  {donationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setDonationType(type.id)}
                      className={`flex-1 py-3 px-4 rounded-full font-medium text-sm transition-all duration-300 ${
                        donationType === type.id
                          ? 'bg-dark text-white border border-dark'
                          : 'bg-white text-dark border border-dark/20 hover:border-dark'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                
                {/* Donation Amounts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {donationAmounts.map((item) => (
                    <button
                      key={item.amount}
                      onClick={() => {
                        setSelectedAmount(item.amount)
                        setCustomAmount('')
                      }}
                      className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                        selectedAmount === item.amount && !customAmount
                          ? 'bg-dark text-white border border-dark'
                          : 'bg-white text-dark border border-dark/10 hover:border-dark/30'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 mx-auto mb-2 ${selectedAmount === item.amount && !customAmount ? 'text-lime' : 'text-dark/70'}`} />
                      <span className="text-lg font-semibold">${item.amount}</span>
                      <p className="text-xs mt-1 opacity-70">{item.impact}</p>
                    </button>
                  ))}
                </div>
                
                {/* Custom Amount */}
                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark/40">$</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setSelectedAmount(0)
                    }}
                    className="w-full pl-10 pr-4 py-4 rounded-2xl border border-dark/20 focus:border-dark focus:ring-0 outline-none text-lg bg-white"
                  />
                </div>
                
                {/* Monthly option */}
                {donationType === 'monthly' && (
                  <div className="bg-lime/10 rounded-2xl p-4 mb-6 flex items-center gap-3 border border-lime/20">
                    <PiCheck className="w-5 h-5 text-dark" />
                    <span className="text-dark/70 text-sm">
                      Monthly giving provides sustained support for children throughout the year.
                    </span>
                  </div>
                )}
                
                {/* Donate Button */}
                <button className="w-full btn-lime py-4 text-lg">
                  <PiHeartFill className="w-5 h-5" />
                  Donate ${customAmount || selectedAmount} {donationType === 'monthly' ? 'Monthly' : 'Now'}
                </button>
                
                {/* Security Note */}
                <div className="mt-6 flex items-center justify-center gap-2 text-dark/50 text-sm">
                  <PiShieldCheck className="w-4 h-4" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </div>
            </motion.div>
            
            {/* Impact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-serif text-dark mb-6">Your Impact</h2>
              
              <div className="space-y-6">
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-dark mb-4">Where Your Money Goes</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-dark/60 text-sm">Programs & Services</span>
                        <span className="font-semibold text-dark text-sm">85%</span>
                      </div>
                      <div className="h-2 bg-dark/10 rounded-full overflow-hidden">
                        <div className="h-full bg-lime rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-dark/60 text-sm">Administration</span>
                        <span className="font-semibold text-dark text-sm">10%</span>
                      </div>
                      <div className="h-2 bg-dark/10 rounded-full overflow-hidden">
                        <div className="h-full bg-dark/40 rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-dark/60 text-sm">Fundraising</span>
                        <span className="font-semibold text-dark text-sm">5%</span>
                      </div>
                      <div className="h-2 bg-dark/10 rounded-full overflow-hidden">
                        <div className="h-full bg-dark/20 rounded-full" style={{ width: '5%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-dark mb-4">Tax Benefits</h3>
                  <p className="text-dark/60 text-sm leading-relaxed">
                    Rescue Mission Orphanage is a registered 501(c)(3) nonprofit organization. 
                    All donations are tax-deductible to the extent allowed by law.
                  </p>
                </div>
                
                <div className="card-premium p-6">
                  <h3 className="font-semibold text-dark mb-4">Other Ways to Give</h3>
                  <ul className="space-y-3 text-dark/60 text-sm">
                    <li className="flex items-center gap-2">
                      <PiCheck className="w-4 h-4 text-lime" />
                      Bank Transfer / Wire
                    </li>
                    <li className="flex items-center gap-2">
                      <PiCheck className="w-4 h-4 text-lime" />
                      Corporate Sponsorship
                    </li>
                    <li className="flex items-center gap-2">
                      <PiCheck className="w-4 h-4 text-lime" />
                      Planned Giving
                    </li>
                    <li className="flex items-center gap-2">
                      <PiCheck className="w-4 h-4 text-lime" />
                      In-Kind Donations
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
