'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/lib/useSettings'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PiGear,
  PiCheck,
  PiArrowCounterClockwise,
  PiGlobe,
  PiPhone,
  PiEnvelope,
  PiCurrencyCircleDollar,
  PiShareNetwork,
  PiTrendUp,
  PiHeart,
  PiUsers,
  PiNewspaper,
  PiFloppyDisk,
  PiPlus,
  PiTrash,
} from 'react-icons/pi'

const tabs = [
  { id: 'general', label: 'General', icon: PiGear },
  { id: 'contact', label: 'Contact', icon: PiPhone },
  { id: 'social', label: 'Social Media', icon: PiShareNetwork },
  { id: 'home', label: 'Home Page', icon: PiGlobe },
  { id: 'impact', label: 'Impact Stats', icon: PiTrendUp },
  { id: 'about', label: 'About Page', icon: PiHeart },
  { id: 'testimonials', label: 'Testimonials', icon: PiNewspaper },
  { id: 'volunteer', label: 'Volunteer & Sponsor', icon: PiUsers },
  { id: 'corporate', label: 'Corporate', icon: PiCurrencyCircleDollar },
  { id: 'donations', label: 'Donations', icon: PiCurrencyCircleDollar },
  { id: 'faq', label: 'FAQ & Partners', icon: PiEnvelope },
]

const inputCls = 'w-full px-4 py-3 rounded-xl border border-dark/15 bg-white text-dark text-sm placeholder:text-dark/35 focus:outline-none focus:border-dark/40 transition-colors'
const labelCls = 'block text-sm font-medium text-dark mb-2'
const sectionCls = 'bg-white rounded-2xl border border-dark/10 p-6 mb-4'

function Field({ label, value, onChange, textarea, placeholder }: { label: string; value: string | number; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-none min-h-[80px]`} placeholder={placeholder} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} placeholder={placeholder} />
      )}
    </div>
  )
}

function ArrayField({ items, onAdd, onRemove, onUpdate, fields }: {
  items: Record<string, string | number>[]
  onAdd: () => void
  onRemove: (i: number) => void
  onUpdate: (i: number, key: string, val: string) => void
  fields: { key: string; label: string; textarea?: boolean }[]
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                {f.textarea ? (
                  <textarea value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)} className={`${inputCls} resize-none min-h-[60px]`} />
                ) : (
                  <input type="text" value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)} className={inputCls} />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => onRemove(i)} className="mt-7 w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0">
            <PiTrash className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={onAdd} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2">
        <PiPlus className="w-4 h-4" /> Add Item
      </button>
    </div>
  )
}

const defaultSettings = () => ({
  general: { orgName: 'Rescue Mission Orphanage', tagline: 'Give Hope To Children In Need', description: 'A dedicated charity organization focused on creating sustainable solutions for those in need. Join us in our mission to provide education, healthcare, and shelter to orphaned children.', foundedYear: '2025', copyrightYear: '2025' },
  contact: { phone1: '+233 24 567 890', phone2: '+233 20 567 891', email1: 'info@rescuemission.org', email2: 'donate@rescuemission.org', address1: '123 Hope Street', address2: 'Accra, Ghana', officeHours1: 'Mon - Fri: 9:00 AM - 5:00 PM', officeHours2: 'Sat: 9:00 AM - 1:00 PM', mediaEmail: 'media@rescuemission.org' },
  social: { facebook: 'https://facebook.com/rescuemission', twitter: 'https://twitter.com/rescuemission', instagram: 'https://instagram.com/rescuemission', youtube: 'https://youtube.com/rescuemission', linkedin: 'https://linkedin.com/company/rescuemission' },
  homeHero: { heading: 'Every child deserves a childhood.', description: 'Rescue Mission Orphanage provides shelter, education, and care to children who need it most — turning hardship into hope, one child at a time.', cta1Text: 'Donate Now', cta2Text: 'Explore Our Work', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80', imageAlt: 'Children playing at Rescue Mission Orphanage' },
  cta: { kicker: 'Give Hope a Home', heading: 'Your kindness becomes a child\'s breakthrough', description: 'Every donation, every volunteer hour, every share — it all adds up to education, healthcare, and a safe home for a child in need.' },
  impactStats: { kicker: 'Our Impact', heading: 'Making a Real Difference', description: 'Measurable, lasting change — from classrooms to clinics, every program is built to lift children out of hardship.', stats: [
    { value: '2,500+', label: 'Children Educated', description: 'Through our learning programs' },
    { value: '500+', label: 'Families Supported', description: 'With emergency relief' },
    { value: '15+', label: 'Communities', description: 'Across multiple regions' },
    { value: 'GH₵2.5M', label: 'Funds Raised', description: 'From generous donors' },
  ]},
  about: { storyHeading: 'A Journey of Hope Since 2025', storyParagraphs: [
    'Rescue Mission Orphanage was founded with a simple yet powerful vision: to provide every orphaned child with the opportunity to grow, learn, and thrive in a safe and nurturing environment.',
    'What started as a small shelter for 10 children has grown into a comprehensive organization serving thousands of children across multiple countries.',
    'Today, we continue to expand our reach and deepen our impact, guided by the belief that every child deserves a chance at a brighter future.',
  ], storyImageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80', missionStatement: 'To provide comprehensive care, education, and support to orphaned and vulnerable children, empowering them to become self-reliant, compassionate, and productive members of society.', visionStatement: 'A world where every orphaned child has access to quality education, healthcare, and the opportunity to realize their full potential in a loving and supportive environment.', values: [
    { title: 'Compassion', description: 'Empathy at the heart of everything we do.' },
    { title: 'Integrity', description: 'Transparency and accountability in all operations.' },
    { title: 'Impact', description: 'Sustainable solutions creating lasting change.' },
    { title: 'Collaboration', description: 'Partnerships amplifying our collective impact.' },
  ], team: [
    { name: 'Grace Mwangi', role: 'Executive Director', bio: '20+ years in nonprofit leadership', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80' },
    { name: 'David Okonkwo', role: 'Programs Director', bio: 'Expert in child development programs', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
    { name: 'Sarah Williams', role: 'Development Manager', bio: 'Passionate about community engagement', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
    { name: 'James Chen', role: 'Finance Director', bio: 'Ensuring transparent financial stewardship', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
  ], milestones: [
    { year: '2025', title: 'Founded', description: 'Established with a vision to help orphaned children.' },
    { year: '2026', title: 'First 100 Children', description: 'Reached milestone of supporting 100 children.' },
  ]},
  testimonials: [
    { quote: 'Supporting Rescue Mission has been one of the most rewarding experiences of my life. Seeing the direct impact on children is incredible.', author: 'Sarah Johnson', role: 'Monthly Donor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { quote: 'Volunteering here changed my perspective on life. The dedication of the team and the joy of the children is truly inspiring.', author: 'Michael Chen', role: 'Volunteer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { quote: 'As a corporate partner, we have seen firsthand how Rescue Mission transforms communities. Their transparency is unmatched.', author: 'Emily Rodriguez', role: 'Corporate Partner', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
  ],
  volunteerRoles: [
    { title: 'Teaching Assistant', commitment: '4 hours/week', description: 'Help children with their studies and homework.' },
    { title: 'Mentor', commitment: '2 hours/week', description: 'Guide and support a child through their journey.' },
    { title: 'Event Coordinator', commitment: 'Flexible', description: 'Help organize and run fundraising events.' },
    { title: 'Skilled Volunteer', commitment: 'Project-based', description: 'Share your professional skills (medical, legal, etc.).' },
  ],
  sponsorship: { monthlyAmount: 50, benefits: ['Monthly updates and photos of your sponsored child', 'Direct correspondence through letters', 'Annual progress reports', 'Invitation to visit (where possible)', 'Tax-deductible donation receipt'] },
  corporate: { tiers: [
    { tier: 'Bronze', amount: 'GH₵5,000/year', benefits: 'Logo on website, social media mentions' },
    { tier: 'Silver', amount: 'GH₵15,000/year', benefits: 'All Bronze + event sponsorship, employee volunteer days' },
    { tier: 'Gold', amount: 'GH₵30,000/year', benefits: 'All Silver + naming rights, board observer seat' },
  ], benefits: ['Brand visibility on our website and events', 'Employee engagement opportunities', 'Tax benefits for corporate donations', 'CSR reporting support', 'Partnership certificates'] },
  donations: { presetAmounts: [
    { amount: 25, impact: 'School supplies for a month' },
    { amount: 50, impact: 'Nutritious meals for a week' },
    { amount: 100, impact: 'Medical care checkup' },
    { amount: 250, impact: 'Safe shelter for a month' },
    { amount: 500, impact: 'Education for a year' },
    { amount: 1000, impact: 'Complete care package' },
  ], allocation: [
    { label: 'Programs & Services', percentage: 85 },
    { label: 'Administration', percentage: 10 },
    { label: 'Fundraising', percentage: 5 },
  ], taxInfo: 'Rescue Mission Orphanage is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law.' },
  faq: [
    { question: 'How can I volunteer?', answer: 'Visit our Get Involved page or contact us directly to learn about volunteer opportunities.' },
    { question: 'Are donations tax-deductible?', answer: 'Yes! We are a registered 501(c)(3) organization. All donations are tax-deductible.' },
    { question: 'How do I sponsor a child?', answer: 'Contact us or visit our Donate page to learn about our sponsorship program.' },
  ],
  partners: [{ name: 'ZenZap' }, { name: 'sparkle' }, { name: 'Lum Labs' }, { name: 'Pulse' }, { name: 'swift' }, { name: 'innovio' }],
})

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const { settings: serverSettings } = useSettings()

  // Merge server data over defaults once it arrives
  useEffect(() => {
    if (!serverSettings) return
    setSettings(prev => {
      const merged: Record<string, unknown> = { ...prev }
      const incoming = serverSettings as unknown as Record<string, unknown>
      for (const key of Object.keys(incoming)) {
        const value = incoming[key]
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          merged[key] = { ...(merged[key] as Record<string, unknown>), ...(value as Record<string, unknown>) }
        } else if (value !== undefined) {
          merged[key] = value
        }
      }
      return merged as typeof prev
    })
  }, [serverSettings])

  const update = (path: string, value: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const updateArrayItem = (path: string, index: number, key: string, value: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) obj = obj[k]
      obj[index][key] = value
      return next
    })
  }

  const addArrayItem = (path: string, template: Record<string, string>) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) obj = obj[k]
      obj.push({ ...template })
      return next
    })
  }

  const removeArrayItem = (path: string, index: number) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) obj = obj[k]
      obj.splice(index, 1)
      return next
    })
  }

  const updateListItem = (path: string, index: number, value: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) obj = obj[k]
      obj[index] = value
      return next
    })
  }

  const addListItem = (path: string, template: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) obj = obj[k]
      obj.push(template)
      return next
    })
  }

  const removeListItem = (path: string, index: number) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) obj = obj[k]
      obj.splice(index, 1)
      return next
    })
  }

  const handleSave = async () => {
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    const fresh = defaultSettings()
    // Preserve fields that aren't in the default object so reset + save never wipes live content.
    if (serverSettings?.homeHero) {
      fresh.homeHero.imageUrl = serverSettings.homeHero.imageUrl || fresh.homeHero.imageUrl
      fresh.homeHero.imageAlt = serverSettings.homeHero.imageAlt || fresh.homeHero.imageAlt
    }
    if (serverSettings?.about?.storyImageUrl) fresh.about.storyImageUrl = serverSettings.about.storyImageUrl
    setSettings(fresh)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-dark">Site Settings</h1>
          <p className="text-dark/50 text-sm mt-1">Manage your website content and details</p>
        </div>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 bg-lime text-dark px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2">
            <PiCheck className="w-5 h-5" /> Settings saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 flex-shrink-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-dark text-white' : 'text-dark/60 hover:bg-dark/5'
              }`}>
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

              {activeTab === 'general' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4 flex items-center gap-2"><PiGear className="text-lg" /> General Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Organization Name" value={settings.general.orgName} onChange={(v) => update('general.orgName', v)} />
                    <Field label="Tagline" value={settings.general.tagline} onChange={(v) => update('general.tagline', v)} />
                    <Field label="Founded Year" value={settings.general.foundedYear} onChange={(v) => update('general.foundedYear', v)} />
                    <Field label="Copyright Year" value={settings.general.copyrightYear} onChange={(v) => update('general.copyrightYear', v)} />
                  </div>
                  <div className="mt-4"><Field label="Description" value={settings.general.description} onChange={(v) => update('general.description', v)} textarea /></div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4 flex items-center gap-2"><PiPhone className="text-lg" /> Contact Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Phone 1" value={settings.contact.phone1} onChange={(v) => update('contact.phone1', v)} />
                    <Field label="Phone 2" value={settings.contact.phone2} onChange={(v) => update('contact.phone2', v)} />
                    <Field label="Email 1" value={settings.contact.email1} onChange={(v) => update('contact.email1', v)} />
                    <Field label="Email 2" value={settings.contact.email2} onChange={(v) => update('contact.email2', v)} />
                    <Field label="Address Line 1" value={settings.contact.address1} onChange={(v) => update('contact.address1', v)} />
                    <Field label="Address Line 2" value={settings.contact.address2} onChange={(v) => update('contact.address2', v)} />
                    <Field label="Office Hours 1" value={settings.contact.officeHours1} onChange={(v) => update('contact.officeHours1', v)} />
                    <Field label="Office Hours 2" value={settings.contact.officeHours2} onChange={(v) => update('contact.officeHours2', v)} />
                    <Field label="Media Email" value={settings.contact.mediaEmail} onChange={(v) => update('contact.mediaEmail', v)} />
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4 flex items-center gap-2"><PiShareNetwork className="text-lg" /> Social Media Links</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Facebook" value={settings.social.facebook} onChange={(v) => update('social.facebook', v)} placeholder="https://facebook.com/..." />
                    <Field label="Twitter / X" value={settings.social.twitter} onChange={(v) => update('social.twitter', v)} placeholder="https://twitter.com/..." />
                    <Field label="Instagram" value={settings.social.instagram} onChange={(v) => update('social.instagram', v)} placeholder="https://instagram.com/..." />
                    <Field label="YouTube" value={settings.social.youtube} onChange={(v) => update('social.youtube', v)} placeholder="https://youtube.com/..." />
                    <Field label="LinkedIn" value={settings.social.linkedin} onChange={(v) => update('social.linkedin', v)} placeholder="https://linkedin.com/..." />
                  </div>
                </div>
              )}

              {activeTab === 'home' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4 flex items-center gap-2"><PiGlobe className="text-lg" /> Hero Section</h2>
                    <div className="space-y-4">
                      <Field label="Heading" value={settings.homeHero.heading} onChange={(v) => update('homeHero.heading', v)} />
                      <Field label="Description" value={settings.homeHero.description} onChange={(v) => update('homeHero.description', v)} textarea />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="CTA 1 Text" value={settings.homeHero.cta1Text} onChange={(v) => update('homeHero.cta1Text', v)} />
                        <Field label="CTA 2 Text" value={settings.homeHero.cta2Text} onChange={(v) => update('homeHero.cta2Text', v)} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Hero Image URL" value={settings.homeHero.imageUrl} onChange={(v) => update('homeHero.imageUrl', v)} placeholder="https://..." />
                        <Field label="Hero Image Alt Text" value={settings.homeHero.imageAlt} onChange={(v) => update('homeHero.imageAlt', v)} />
                      </div>
                    </div>
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Call To Action Section</h2>
                    <div className="space-y-4">
                      <Field label="Kicker" value={settings.cta.kicker} onChange={(v) => update('cta.kicker', v)} />
                      <Field label="Heading" value={settings.cta.heading} onChange={(v) => update('cta.heading', v)} />
                      <Field label="Description" value={settings.cta.description} onChange={(v) => update('cta.description', v)} textarea />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'impact' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4 flex items-center gap-2"><PiTrendUp className="text-lg" /> Impact Statistics</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.impactStats.kicker} onChange={(v) => update('impactStats.kicker', v)} />
                      <Field label="Heading" value={settings.impactStats.heading} onChange={(v) => update('impactStats.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.impactStats.description} onChange={(v) => update('impactStats.description', v)} textarea />
                    <div className="mt-4">
                      <h3 className="font-semibold text-dark mb-3">Stats</h3>
                      <ArrayField items={settings.impactStats.stats} onAdd={() => addArrayItem('impactStats.stats', { value: '', label: '', description: '' })} onRemove={(i) => removeArrayItem('impactStats.stats', i)} onUpdate={(i, k, v) => updateArrayItem('impactStats.stats', i, k, v)} fields={[{ key: 'value', label: 'Value' }, { key: 'label', label: 'Label' }, { key: 'description', label: 'Description' }]} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Story Section</h2>
                    <div className="space-y-4">
                      <Field label="Story Heading" value={settings.about.storyHeading} onChange={(v) => update('about.storyHeading', v)} />
                      {settings.about.storyParagraphs.map((p: string, i: number) => (
                        <Field key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(v) => updateListItem('about.storyParagraphs', i, v)} textarea />
                      ))}
                      <Field label="Story Image URL" value={settings.about.storyImageUrl} onChange={(v) => update('about.storyImageUrl', v)} placeholder="https://..." />
                    </div>
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Mission & Vision</h2>
                    <div className="space-y-4">
                      <Field label="Mission Statement" value={settings.about.missionStatement} onChange={(v) => update('about.missionStatement', v)} textarea />
                      <Field label="Vision Statement" value={settings.about.visionStatement} onChange={(v) => update('about.visionStatement', v)} textarea />
                    </div>
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Values</h2>
                    <ArrayField items={settings.about.values} onAdd={() => addArrayItem('about.values', { title: '', description: '' })} onRemove={(i) => removeArrayItem('about.values', i)} onUpdate={(i, k, v) => updateArrayItem('about.values', i, k, v)} fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', textarea: true }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Team Members</h2>
                    <ArrayField items={settings.about.team} onAdd={() => addArrayItem('about.team', { name: '', role: '', bio: '', avatar: '' })} onRemove={(i) => removeArrayItem('about.team', i)} onUpdate={(i, k, v) => updateArrayItem('about.team', i, k, v)} fields={[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'bio', label: 'Bio' }, { key: 'avatar', label: 'Avatar URL' }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Milestones</h2>
                    <ArrayField items={settings.about.milestones} onAdd={() => addArrayItem('about.milestones', { year: '', title: '', description: '' })} onRemove={(i) => removeArrayItem('about.milestones', i)} onUpdate={(i, k, v) => updateArrayItem('about.milestones', i, k, v)} fields={[{ key: 'year', label: 'Year' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description', textarea: true }]} />
                  </div>
                </>
              )}

              {activeTab === 'testimonials' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Testimonials</h2>
                  <ArrayField items={settings.testimonials} onAdd={() => addArrayItem('testimonials', { quote: '', author: '', role: '', avatar: '' })} onRemove={(i) => removeArrayItem('testimonials', i)} onUpdate={(i, k, v) => updateArrayItem('testimonials', i, k, v)} fields={[{ key: 'quote', label: 'Quote', textarea: true }, { key: 'author', label: 'Author Name' }, { key: 'role', label: 'Role' }, { key: 'avatar', label: 'Avatar URL' }]} />
                </div>
              )}

              {activeTab === 'volunteer' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Volunteer Roles</h2>
                    <ArrayField items={settings.volunteerRoles} onAdd={() => addArrayItem('volunteerRoles', { title: '', commitment: '', description: '' })} onRemove={(i) => removeArrayItem('volunteerRoles', i)} onUpdate={(i, k, v) => updateArrayItem('volunteerRoles', i, k, v)} fields={[{ key: 'title', label: 'Title' }, { key: 'commitment', label: 'Commitment' }, { key: 'description', label: 'Description' }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Sponsorship</h2>
                    <div className="space-y-4">
                      <Field label="Monthly Amount (GH₵)" value={settings.sponsorship.monthlyAmount} onChange={(v) => update('sponsorship.monthlyAmount', v)} />
                      <div>
                        <label className={labelCls}>Benefits</label>
                        {settings.sponsorship.benefits.map((b: string, i: number) => (
                          <div key={i} className="flex gap-2 mb-2">
                            <input type="text" value={b} onChange={(e) => updateListItem('sponsorship.benefits', i, e.target.value)} className={inputCls} />
                            <button onClick={() => removeListItem('sponsorship.benefits', i)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 flex-shrink-0"><PiTrash className="w-4 h-4" /></button>
                          </div>
                        ))}
                        <button onClick={() => addListItem('sponsorship.benefits', '')} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Benefit</button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'corporate' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Partnership Tiers</h2>
                    <ArrayField items={settings.corporate.tiers} onAdd={() => addArrayItem('corporate.tiers', { tier: '', amount: '', benefits: '' })} onRemove={(i) => removeArrayItem('corporate.tiers', i)} onUpdate={(i, k, v) => updateArrayItem('corporate.tiers', i, k, v)} fields={[{ key: 'tier', label: 'Tier Name' }, { key: 'amount', label: 'Amount' }, { key: 'benefits', label: 'Benefits', textarea: true }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Partner Benefits</h2>
                    {settings.corporate.benefits.map((b: string, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={b} onChange={(e) => updateListItem('corporate.benefits', i, e.target.value)} className={inputCls} />
                        <button onClick={() => removeListItem('corporate.benefits', i)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 flex-shrink-0"><PiTrash className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => addListItem('corporate.benefits', '')} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Benefit</button>
                  </div>
                </>
              )}

              {activeTab === 'donations' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Preset Amounts</h2>
                    <ArrayField items={settings.donations.presetAmounts} onAdd={() => addArrayItem('donations.presetAmounts', { amount: '', impact: '' })} onRemove={(i) => removeArrayItem('donations.presetAmounts', i)} onUpdate={(i, k, v) => updateArrayItem('donations.presetAmounts', i, k, v)} fields={[{ key: 'amount', label: 'Amount (GH₵)' }, { key: 'impact', label: 'Impact Description' }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Allocation Breakdown</h2>
                    <ArrayField items={settings.donations.allocation} onAdd={() => addArrayItem('donations.allocation', { label: '', percentage: '' })} onRemove={(i) => removeArrayItem('donations.allocation', i)} onUpdate={(i, k, v) => updateArrayItem('donations.allocation', i, k, v)} fields={[{ key: 'label', label: 'Label' }, { key: 'percentage', label: 'Percentage' }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Tax Information</h2>
                    <Field label="Tax Info" value={settings.donations.taxInfo} onChange={(v) => update('donations.taxInfo', v)} textarea />
                  </div>
                </>
              )}

              {activeTab === 'faq' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">FAQ</h2>
                    <ArrayField items={settings.faq} onAdd={() => addArrayItem('faq', { question: '', answer: '' })} onRemove={(i) => removeArrayItem('faq', i)} onUpdate={(i, k, v) => updateArrayItem('faq', i, k, v)} fields={[{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', textarea: true }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Partners</h2>
                    {settings.partners.map((p: { name: string }, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={p.name} onChange={(e) => updateArrayItem('partners', i, 'name', e.target.value)} className={inputCls} />
                        <button onClick={() => removeArrayItem('partners', i)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 flex-shrink-0"><PiTrash className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('partners', { name: '' })} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Partner</button>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={handleSave} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-dark text-white font-extrabold text-sm tracking-wide hover:bg-dark-50 transition-colors">
              <PiFloppyDisk className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-dark/20 text-dark font-extrabold text-sm tracking-wide hover:border-dark/40 transition-colors">
              <PiArrowCounterClockwise className="w-4 h-4" /> Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
