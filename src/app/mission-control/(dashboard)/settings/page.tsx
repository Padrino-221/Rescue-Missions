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
  PiImageFill,
  PiCalendar,
  PiSpinner,
} from 'react-icons/pi'
import ImageUpload from '@/components/ui/ImageUpload'
import { useToast } from '@/components/ui/Toast'
import { useAlert } from '@/components/ui/Alert'

const tabs = [
  { id: 'general', label: 'General', icon: PiGear },
  { id: 'contact', label: 'Contact', icon: PiPhone },
  { id: 'social', label: 'Social Media', icon: PiShareNetwork },
  { id: 'home', label: 'Home Hero', icon: PiGlobe },
  { id: 'explore', label: 'Explore Our Work', icon: PiGlobe },
  { id: 'cta', label: 'Call To Action', icon: PiGlobe },
  { id: 'impact', label: 'Impact Stats', icon: PiTrendUp },
  { id: 'howwehelp', label: 'How We Help', icon: PiHeart },
  { id: 'featured', label: 'Featured Story', icon: PiNewspaper },
  { id: 'programs', label: 'Programs', icon: PiGear },
  { id: 'gallery', label: 'Gallery', icon: PiImageFill },
  { id: 'stories', label: 'Stories', icon: PiNewspaper },
  { id: 'events', label: 'Events', icon: PiCalendar },
  { id: 'about', label: 'About Page', icon: PiHeart },
  { id: 'getinvolved', label: 'Get Involved', icon: PiUsers },
  { id: 'contactpage', label: 'Contact Page', icon: PiPhone },
  { id: 'testimonials', label: 'Testimonials', icon: PiNewspaper },
  { id: 'volunteer', label: 'Volunteer & Sponsor', icon: PiUsers },
  { id: 'corporate', label: 'Corporate', icon: PiCurrencyCircleDollar },
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

function ArrayField({ items, onAdd, onRemove, onUpdate, fields, folder }: {
  items: Record<string, string | number>[]
  onAdd: () => void
  onRemove: (i: number) => void
  onUpdate: (i: number, key: string, val: string) => void
  fields: { key: string; label: string; textarea?: boolean; image?: boolean; aspect?: number }[]
  folder?: string
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                {f.image ? (
                  <ImageUpload value={String(item[f.key] || '')} onChange={(v) => onUpdate(i, f.key, v)} folder={folder} label={f.label} aspect={f.aspect} />
                ) : (
                  <>
                    <label className={labelCls}>{f.label}</label>
                    {f.textarea ? (
                      <textarea value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)} className={`${inputCls} resize-none min-h-[60px]`} />
                    ) : (
                      <input type="text" value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)} className={inputCls} />
                    )}
                  </>
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
  general: { orgName: '', tagline: '', description: '', foundedYear: '', copyrightYear: '' },
  siteUrl: '',
  contact: { phone1: '', phone2: '', email1: '', email2: '', address1: '', address2: '', officeHours1: '', officeHours2: '', mediaEmail: '' },
  social: { items: [] },
  homeHero: { heading: '', description: '', cta1Text: '', cta2Text: '', imageUrl: '', imageAlt: '' },
  exploreOurWork: { kicker: '', heading: '', description: '', items: [] },
  cta: { kicker: '', heading: '', description: '' },
  impactStats: { kicker: '', heading: '', description: '', stats: [] },
  howWeHelp: { kicker: '', heading: '', description: '', imageUrl: '', imageAlt: '', tags: [], services: [] },
  featuredStory: { kicker: '', heading: '', description: '', imageUrl: '', imageAlt: '', progressBars: [], quote: '', quoteAuthor: '', quoteRole: '', quoteAvatar: '' },
  about: { kicker: '', heading: '', heroDescription: '', storyHeading: '', storyParagraphs: [], storyImageUrl: '', missionStatement: '', visionStatement: '', values: [], team: [], milestones: [] },
  programs: { kicker: '', heading: '', description: '', ctaHeading: '', ctaDescription: '' },
  gallery: { kicker: '', heading: '', description: '', pressHeading: '', pressDescription: '', categories: [] },
  stories: { kicker: '', heading: '', description: '', categories: [] },
  events: { kicker: '', heading: '', description: '' },
  getInvolved: { kicker: '', heading: '', description: '', volunteerHeading: '', volunteerDescription: '', sponsorHeading: '', sponsorDescription: '', corporateHeading: '', corporateDescription: '' },
  contactPage: { kicker: '', heading: '', description: '', formHeading: '', infoHeading: '', socialHeading: '', faqHeading: '' },
  testimonials: { kicker: '', heading: '', description: '', items: [] },
  volunteerRoles: [],
  sponsorship: { monthlyAmount: 0, benefits: [] },
  sponsorshipNeeds: [],
  corporate: { tiers: [], benefits: [] },
  faq: [],
  partners: { kicker: '', items: [] },
})

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const { settings: serverSettings, loading: settingsLoading } = useSettings()
  const { toast } = useToast()
  const { confirm } = useAlert()
  // Null means the fetch failed. An empty object means "no saved settings yet"
  // (fresh DB) — saving must still be allowed in that case.
  const fetchFailed = !settingsLoading && serverSettings === null
  const settingsReady = !settingsLoading && serverSettings !== null
  // Snapshot of what the server had when we loaded, so Save only sends keys
  // the user actually changed. Untouched sections (e.g. programs/gallery
  // edited on their dedicated pages) are left alone on the server.
  const [baselineJson, setBaselineJson] = useState<string | null>(null)
  const baselineRef = useState({ mergedOnce: false })[0]

  // Merge server data over defaults once it arrives. Null values never wipe defaults.
  useEffect(() => {
    if (serverSettings === null || serverSettings === undefined) return
    if (baselineRef.mergedOnce) return
    baselineRef.mergedOnce = true
    // Defer to a microtask to avoid synchronously calling setState inside an effect
    queueMicrotask(() => {
      setSettings(prev => {
        const merged: Record<string, unknown> = { ...prev }
        const incoming = serverSettings as unknown as Record<string, unknown>
        for (const key of Object.keys(incoming)) {
          const value = incoming[key]
          if (value === undefined || value === null) continue
          if (typeof value === 'object' && !Array.isArray(value)) {
            const baseSection = (merged[key] as Record<string, unknown>) ?? {}
            merged[key] = { ...baseSection, ...(value as Record<string, unknown>) }
          } else {
            merged[key] = value
          }
        }
        // One-time forward migration: older saves kept child-specific
        // `sponsoredChildren`; the section is now generic `sponsorshipNeeds`.
        const needs = merged.sponsorshipNeeds
        const legacy = merged.sponsoredChildren
        if ((!Array.isArray(needs) || needs.length === 0) && Array.isArray(legacy) && legacy.length > 0) {
          merged.sponsorshipNeeds = (legacy as Record<string, unknown>[]).map((c) => ({
            title: String(c.name || ''),
            detail: [c.age ? `Age ${c.age}` : '', String(c.note || '')].filter(Boolean).join(' • '),
            amount: '',
            image: String(c.image || ''),
          }))
        }
        setBaselineJson(JSON.stringify(merged))
        return merged as typeof prev
      })
    })
  }, [serverSettings, baselineRef])

  const update = (path: string, value: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === null || typeof obj[keys[i]] !== 'object') obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const updateArrayItem = (path: string, index: number, key: string, value: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) {
        if (obj[k] === null || typeof obj[k] !== 'object') return prev
        obj = obj[k]
      }
      obj[index][key] = value
      return next
    })
  }

  const addArrayItem = (path: string, template: Record<string, string>) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) {
        if (obj[k] === null || typeof obj[k] !== 'object') return prev
        obj = obj[k]
      }
      if (!Array.isArray(obj)) return prev
      obj.push({ ...template })
      return next
    })
  }

  const removeArrayItem = (path: string, index: number) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) {
        if (obj[k] === null || typeof obj[k] !== 'object') return prev
        obj = obj[k]
      }
      if (!Array.isArray(obj)) return prev
      obj.splice(index, 1)
      return next
    })
  }

  const updateListItem = (path: string, index: number, value: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) {
        if (obj[k] === null || typeof obj[k] !== 'object') return prev
        obj = obj[k]
      }
      if (!Array.isArray(obj)) return prev
      obj[index] = value
      return next
    })
  }

  const addListItem = (path: string, template: string) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) {
        if (obj[k] === null || typeof obj[k] !== 'object') return prev
        obj = obj[k]
      }
      if (!Array.isArray(obj)) return prev
      obj.push(template)
      return next
    })
  }

  const removeListItem = (path: string, index: number) => {
    setSettings(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (const k of keys) {
        if (obj[k] === null || typeof obj[k] !== 'object') return prev
        obj = obj[k]
      }
      if (!Array.isArray(obj)) return prev
      obj.splice(index, 1)
      return next
    })
  }

  const buildPayload = () => {
    const current = JSON.parse(JSON.stringify(settings)) as Record<string, unknown>
    // Coerce text inputs back to the numeric shapes the site expects.
    const sponsorship = current.sponsorship as Record<string, unknown> | undefined
    if (sponsorship && typeof sponsorship === 'object' && 'monthlyAmount' in sponsorship) {
      const n = Number(sponsorship.monthlyAmount)
      if (Number.isFinite(n)) sponsorship.monthlyAmount = n
    }
    const featured = current.featuredStory as Record<string, unknown> | undefined
    if (featured && typeof featured === 'object' && Array.isArray(featured.progressBars)) {
      featured.progressBars = (featured.progressBars as Record<string, unknown>[]).map((bar) => {
        const n = Number((bar as Record<string, unknown>).percentage)
        return { ...bar, percentage: Number.isFinite(n) ? n : 0 }
      })
    }
    // programs.items and gallery.items are managed on their dedicated pages
    // (which persist complete records). Never send them from here so a stale
    // settings form cannot wipe live client content.
    if (current.programs && typeof current.programs === 'object') {
      const { items: _omitPrograms, ...programsMeta } = current.programs as Record<string, unknown>
      current.programs = programsMeta
    }
    if (current.gallery && typeof current.gallery === 'object') {
      const { items: _omitGallery, ...galleryMeta } = current.gallery as Record<string, unknown>
      current.gallery = galleryMeta
    }
    // Fresh DB (no baseline): send everything except the omitted item arrays.
    if (!baselineJson) return current
    const baseline = JSON.parse(baselineJson) as Record<string, unknown>
    const stripItems = (section: unknown) => {
      if (section && typeof section === 'object' && !Array.isArray(section) && 'items' in (section as Record<string, unknown>)) {
        const { items: _omit, ...rest } = section as Record<string, unknown>
        return rest
      }
      return section
    }
    const payload: Record<string, unknown> = {}
    for (const key of Object.keys(current)) {
      if (key === 'programs' || key === 'gallery') {
        // Only metadata (already stripped of items) — include if changed.
        if (JSON.stringify(current[key]) !== JSON.stringify(stripItems((baseline as Record<string, unknown>)[key]))) {
          payload[key] = current[key]
        }
        continue
      }
      if (JSON.stringify(current[key]) !== JSON.stringify((baseline as Record<string, unknown>)[key])) {
        payload[key] = current[key]
      }
    }
    return payload
  }

  const handleSave = async () => {
    if (!settingsReady) {
      toast(
        fetchFailed
          ? 'Could not load the saved settings, so saving is disabled to avoid overwriting them.'
          : 'Settings are still loading. Please wait a moment and try again.',
        'error'
      )
      return
    }
    const payload = buildPayload()
    if (Object.keys(payload).length === 0) {
      toast('No changes to save.', 'error')
      return
    }
    setSaving(true)
    try {
      // Payload only contains changed sections (and never programs/gallery
      // items), so the server-side deep merge preserves live content edited
      // elsewhere.
      const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Save failed')
      setBaselineJson(JSON.stringify({ ...(JSON.parse(baselineJson ?? '{}')), ...JSON.parse(JSON.stringify(settings)) }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
      toast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const tabTopKeys: Record<string, string[]> = {
    general: ['general', 'siteUrl'],
    contact: ['contact'],
    social: ['social'],
    home: ['homeHero'],
    explore: ['exploreOurWork'],
    cta: ['cta'],
    impact: ['impactStats'],
    howwehelp: ['howWeHelp'],
    featured: ['featuredStory'],
    programs: ['programs'],
    gallery: ['gallery'],
    stories: ['stories'],
    events: ['events'],
    about: ['about'],
    getinvolved: ['getInvolved'],
    contactpage: ['contactPage'],
    testimonials: ['testimonials'],
    volunteer: ['volunteerRoles', 'sponsorship', 'sponsorshipNeeds'],
    corporate: ['corporate'],
    faq: ['faq', 'partners'],
  }

  const handleReset = () => {
    const activeLabel = tabs.find((t) => t.id === activeTab)?.label ?? activeTab
    confirm({
      title: `Reset ${activeLabel}?`,
      message:
        'This clears only the section you are viewing back to blank. Other sections and your live site are unchanged until you click Save Changes.',
      icon: 'warning',
      confirmLabel: 'Clear section',
      onConfirm: () => {
        const fresh = defaultSettings() as unknown as Record<string, unknown>
        const keys = tabTopKeys[activeTab] ?? []
        setSettings((prev) => {
          const next = JSON.parse(JSON.stringify(prev)) as Record<string, unknown>
          for (const k of keys) {
            next[k] = fresh[k]
          }
          return next as typeof prev
        })
      },
    })
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
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-col lg:w-56 gap-1 lg:overflow-x-visible pb-2 lg:pb-0 flex-shrink-0">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-left text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-dark text-white' : 'text-dark/60 hover:bg-dark/5'
              }`}>
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  <div className="mt-4"><Field label="Site URL" value={settings.siteUrl} onChange={(v) => update('siteUrl', v)} placeholder="https://example.com" /></div>
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
                  <p className="text-dark/50 text-sm mb-4">Add any social media platform. Use the name field for the platform (e.g. Facebook, Twitter, Instagram, TikTok, etc.).</p>
                  <ArrayField
                    items={settings.social.items}
                    onAdd={() => addArrayItem('social.items', { name: '', url: '' })}
                    onRemove={(i) => removeArrayItem('social.items', i)}
                    onUpdate={(i, k, v) => updateArrayItem('social.items', i, k, v)}
                    fields={[
                      { key: 'name', label: 'Platform (e.g. Facebook, Twitter, TikTok)' },
                      { key: 'url', label: 'URL (https://...)' },
                    ]}
                  />
                </div>
              )}

              {activeTab === 'home' && (
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
                      <Field label="Hero Image Alt Text" value={settings.homeHero.imageAlt} onChange={(v) => update('homeHero.imageAlt', v)} />
                    </div>
                    <ImageUpload value={settings.homeHero.imageUrl} onChange={(v) => update('homeHero.imageUrl', v)} folder="rescue-mission/hero" label="Hero Image" aspect={4 / 3} />
                  </div>
                </div>
              )}

              {activeTab === 'explore' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Explore Our Work Section</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.exploreOurWork.kicker} onChange={(v) => update('exploreOurWork.kicker', v)} />
                      <Field label="Heading" value={settings.exploreOurWork.heading} onChange={(v) => update('exploreOurWork.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.exploreOurWork.description} onChange={(v) => update('exploreOurWork.description', v)} textarea />
                    <div className="mt-4">
                      <h3 className="font-semibold text-dark mb-3">Items</h3>
                      <ArrayField items={settings.exploreOurWork.items} onAdd={() => addArrayItem('exploreOurWork.items', { index: '', title: '', subtitle: '', description: '', href: '', imageUrl: '' })} onRemove={(i) => removeArrayItem('exploreOurWork.items', i)} onUpdate={(i, k, v) => updateArrayItem('exploreOurWork.items', i, k, v)} fields={[{ key: 'index', label: 'Index' }, { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' }, { key: 'description', label: 'Description', textarea: true }, { key: 'href', label: 'Link URL' }, { key: 'imageUrl', label: 'Image', image: true, aspect: 4 / 3 }]} folder="rescue-mission/explore" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cta' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Call To Action Section</h2>
                  <div className="space-y-4">
                    <Field label="Kicker" value={settings.cta.kicker} onChange={(v) => update('cta.kicker', v)} />
                    <Field label="Heading" value={settings.cta.heading} onChange={(v) => update('cta.heading', v)} />
                    <Field label="Description" value={settings.cta.description} onChange={(v) => update('cta.description', v)} textarea />
                  </div>
                </div>
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
                    <h2 className="text-lg font-serif text-dark mb-4">Page Hero</h2>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Kicker" value={settings.about.kicker} onChange={(v) => update('about.kicker', v)} />
                        <Field label="Heading" value={settings.about.heading} onChange={(v) => update('about.heading', v)} />
                      </div>
                      <Field label="Hero Description" value={settings.about.heroDescription} onChange={(v) => update('about.heroDescription', v)} textarea />
                    </div>
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Story Section</h2>
                    <div className="space-y-4">
                      <Field label="Story Heading" value={settings.about.storyHeading} onChange={(v) => update('about.storyHeading', v)} />
                      {settings.about.storyParagraphs.map((p: string, i: number) => (
                        <div key={i} className="flex gap-2 items-start">
                          <div className="flex-1">
                            <Field label={`Paragraph ${i + 1}`} value={p} onChange={(v) => updateListItem('about.storyParagraphs', i, v)} textarea />
                          </div>
                          <button onClick={() => removeListItem('about.storyParagraphs', i)} className="mt-7 w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors flex-shrink-0">
                            <PiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addListItem('about.storyParagraphs', '')} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Paragraph</button>
                      <ImageUpload value={settings.about.storyImageUrl} onChange={(v) => update('about.storyImageUrl', v)} folder="rescue-mission/about" label="Story Image" aspect={4 / 3} />
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
                    <ArrayField items={settings.about.team} onAdd={() => addArrayItem('about.team', { name: '', role: '', bio: '', avatar: '' })} onRemove={(i) => removeArrayItem('about.team', i)} onUpdate={(i, k, v) => updateArrayItem('about.team', i, k, v)} fields={[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'bio', label: 'Bio (shown in full on their profile page)', textarea: true }, { key: 'avatar', label: 'Avatar', image: true, aspect: 3 / 4 }]} folder="rescue-mission/team" />
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
                  <div className="space-y-4 mb-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.testimonials.kicker} onChange={(v) => update('testimonials.kicker', v)} />
                      <Field label="Heading" value={settings.testimonials.heading} onChange={(v) => update('testimonials.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.testimonials.description} onChange={(v) => update('testimonials.description', v)} textarea />
                  </div>
                  <ArrayField items={settings.testimonials.items} onAdd={() => addArrayItem('testimonials.items', { quote: '', author: '', role: '', avatar: '' })} onRemove={(i) => removeArrayItem('testimonials.items', i)} onUpdate={(i, k, v) => updateArrayItem('testimonials.items', i, k, v)} fields={[{ key: 'quote', label: 'Quote', textarea: true }, { key: 'author', label: 'Author Name' }, { key: 'role', label: 'Role' }, { key: 'avatar', label: 'Avatar', image: true, aspect: 1 }]} folder="rescue-mission/testimonials" />
                </div>
              )}

              {activeTab === 'volunteer' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Volunteer Roles</h2>
                    <ArrayField items={settings.volunteerRoles} onAdd={() => addArrayItem('volunteerRoles', { title: '', commitment: '', description: '' })} onRemove={(i) => removeArrayItem('volunteerRoles', i)} onUpdate={(i, k, v) => updateArrayItem('volunteerRoles', i, k, v)} fields={[{ key: 'title', label: 'Title' }, { key: 'commitment', label: 'Commitment' }, { key: 'description', label: 'Description' }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">For Sponsorship</h2>
                    <p className="text-dark/50 text-sm mb-4">Items people can sponsor — e.g. school bus, laptops, land. Shown under Get Involved → Sponsor.</p>
                    <ArrayField items={settings.sponsorshipNeeds} onAdd={() => addArrayItem('sponsorshipNeeds', { title: '', detail: '', amount: '', image: '' })} onRemove={(i) => removeArrayItem('sponsorshipNeeds', i)} onUpdate={(i, k, v) => updateArrayItem('sponsorshipNeeds', i, k, v)} fields={[{ key: 'title', label: 'Item (e.g. School bus, Laptops, Land)' }, { key: 'detail', label: 'Details' }, { key: 'amount', label: 'Amount (optional)' }, { key: 'image', label: 'Photo', image: true, aspect: 1 }]} folder="rescue-mission/sponsorship-needs" />
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

              {activeTab === 'faq' && (
                <>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">FAQ</h2>
                    <ArrayField items={settings.faq} onAdd={() => addArrayItem('faq', { question: '', answer: '' })} onRemove={(i) => removeArrayItem('faq', i)} onUpdate={(i, k, v) => updateArrayItem('faq', i, k, v)} fields={[{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', textarea: true }]} />
                  </div>
                  <div className={sectionCls}>
                    <h2 className="text-lg font-serif text-dark mb-4">Partners</h2>
                    <Field label="Section Kicker" value={settings.partners.kicker} onChange={(v) => update('partners.kicker', v)} />
                    {settings.partners.items.map((p: { name: string }, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={p.name} onChange={(e) => updateArrayItem('partners.items', i, 'name', e.target.value)} className={inputCls} />
                        <button onClick={() => removeArrayItem('partners.items', i)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 flex-shrink-0"><PiTrash className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('partners.items', { name: '' })} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Partner</button>
                  </div>
                </>
              )}

              {activeTab === 'howwehelp' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">How We Help Section</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.howWeHelp.kicker} onChange={(v) => update('howWeHelp.kicker', v)} />
                      <Field label="Heading" value={settings.howWeHelp.heading} onChange={(v) => update('howWeHelp.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.howWeHelp.description} onChange={(v) => update('howWeHelp.description', v)} textarea />
                    <ImageUpload value={settings.howWeHelp.imageUrl} onChange={(v) => update('howWeHelp.imageUrl', v)} folder="rescue-mission/howwehelp" label="Section Image" aspect={4 / 3} />
                    <Field label="Image Alt Text" value={settings.howWeHelp.imageAlt} onChange={(v) => update('howWeHelp.imageAlt', v)} />
                    <div>
                      <label className={labelCls}>Tags</label>
                      {settings.howWeHelp.tags.map((tag: string, i: number) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input type="text" value={tag} onChange={(e) => updateListItem('howWeHelp.tags', i, e.target.value)} className={inputCls} />
                          <button onClick={() => removeListItem('howWeHelp.tags', i)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 flex-shrink-0"><PiTrash className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => addListItem('howWeHelp.tags', '')} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Tag</button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-3">Services</h3>
                      <ArrayField items={settings.howWeHelp.services} onAdd={() => addArrayItem('howWeHelp.services', { title: '', description: '' })} onRemove={(i) => removeArrayItem('howWeHelp.services', i)} onUpdate={(i, k, v) => updateArrayItem('howWeHelp.services', i, k, v)} fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', textarea: true }]} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'featured' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Featured Story Section</h2>
                  <p className="text-xs text-dark/60 bg-cream rounded-xl px-4 py-3 mb-4">
                    This is the highlighted story block on the homepage. To pin a story to the top of the Stories page instead, use the Featured toggle in the story editor.
                  </p>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.featuredStory.kicker} onChange={(v) => update('featuredStory.kicker', v)} />
                      <Field label="Heading" value={settings.featuredStory.heading} onChange={(v) => update('featuredStory.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.featuredStory.description} onChange={(v) => update('featuredStory.description', v)} textarea />
                    <ImageUpload value={settings.featuredStory.imageUrl} onChange={(v) => update('featuredStory.imageUrl', v)} folder="rescue-mission/featured" label="Section Image" aspect={4 / 3} />
                    <Field label="Image Alt Text" value={settings.featuredStory.imageAlt} onChange={(v) => update('featuredStory.imageAlt', v)} />
                    <div>
                      <h3 className="font-semibold text-dark mb-3">Progress Bars</h3>
                      <ArrayField items={settings.featuredStory.progressBars} onAdd={() => addArrayItem('featuredStory.progressBars', { label: '', percentage: '80', color: 'bg-lime' })} onRemove={(i) => removeArrayItem('featuredStory.progressBars', i)} onUpdate={(i, k, v) => updateArrayItem('featuredStory.progressBars', i, k, v)} fields={[{ key: 'label', label: 'Label' }, { key: 'percentage', label: 'Percentage' }, { key: 'color', label: 'Color (Tailwind)' }]} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Quote" value={settings.featuredStory.quote} onChange={(v) => update('featuredStory.quote', v)} textarea />
                      <div className="space-y-4">
                        <Field label="Quote Author" value={settings.featuredStory.quoteAuthor} onChange={(v) => update('featuredStory.quoteAuthor', v)} />
                        <Field label="Quote Role" value={settings.featuredStory.quoteRole} onChange={(v) => update('featuredStory.quoteRole', v)} />
                        <ImageUpload value={settings.featuredStory.quoteAvatar} onChange={(v) => update('featuredStory.quoteAvatar', v)} folder="rescue-mission/featured" label="Author Avatar" aspect={1} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'programs' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Programs Page</h2>
                  <p className="text-xs text-dark/60 bg-cream rounded-xl px-4 py-3 mb-4">
                    Add or edit individual programs (including icons, key activities, and impact stats) on the <strong>Programs</strong> page in the sidebar. Those changes save separately and are never overwritten from here.
                  </p>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.programs.kicker} onChange={(v) => update('programs.kicker', v)} />
                      <Field label="Heading" value={settings.programs.heading} onChange={(v) => update('programs.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.programs.description} onChange={(v) => update('programs.description', v)} textarea />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="CTA Heading" value={settings.programs.ctaHeading} onChange={(v) => update('programs.ctaHeading', v)} />
                      <Field label="CTA Description" value={settings.programs.ctaDescription} onChange={(v) => update('programs.ctaDescription', v)} textarea />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Gallery Page</h2>
                  <p className="text-xs text-dark/60 bg-cream rounded-xl px-4 py-3 mb-4">
                    Add or edit individual photos and videos on the <strong>Gallery</strong> page in the sidebar. Those changes save separately and are never overwritten from here.
                  </p>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.gallery.kicker} onChange={(v) => update('gallery.kicker', v)} />
                      <Field label="Heading" value={settings.gallery.heading} onChange={(v) => update('gallery.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.gallery.description} onChange={(v) => update('gallery.description', v)} textarea />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Press Heading" value={settings.gallery.pressHeading} onChange={(v) => update('gallery.pressHeading', v)} />
                      <Field label="Press Description" value={settings.gallery.pressDescription} onChange={(v) => update('gallery.pressDescription', v)} />
                    </div>
                    <div>
                      <label className={labelCls}>Categories</label>
                      {settings.gallery.categories.map((cat: string, i: number) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input type="text" value={cat} onChange={(e) => updateListItem('gallery.categories', i, e.target.value)} className={inputCls} />
                          <button onClick={() => removeListItem('gallery.categories', i)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 flex-shrink-0"><PiTrash className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => addListItem('gallery.categories', '')} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Category</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stories' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Stories Page</h2>
                  <p className="text-xs text-dark/60 bg-cream rounded-xl px-4 py-3 mb-4">
                    These categories power the filters on the public Stories page and the story editor.
                  </p>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.stories.kicker} onChange={(v) => update('stories.kicker', v)} />
                      <Field label="Heading" value={settings.stories.heading} onChange={(v) => update('stories.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.stories.description} onChange={(v) => update('stories.description', v)} textarea />
                    <div>
                      <label className={labelCls}>Categories</label>
                      {settings.stories.categories.map((cat: string, i: number) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input type="text" value={cat} onChange={(e) => updateListItem('stories.categories', i, e.target.value)} className={inputCls} />
                          <button onClick={() => removeListItem('stories.categories', i)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 flex-shrink-0"><PiTrash className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => addListItem('stories.categories', '')} className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark mt-2"><PiPlus className="w-4 h-4" /> Add Category</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Events Page</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.events.kicker} onChange={(v) => update('events.kicker', v)} />
                      <Field label="Heading" value={settings.events.heading} onChange={(v) => update('events.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.events.description} onChange={(v) => update('events.description', v)} textarea />
                  </div>
                </div>
              )}

              {activeTab === 'getinvolved' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Get Involved Page</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.getInvolved.kicker} onChange={(v) => update('getInvolved.kicker', v)} />
                      <Field label="Heading" value={settings.getInvolved.heading} onChange={(v) => update('getInvolved.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.getInvolved.description} onChange={(v) => update('getInvolved.description', v)} textarea />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Volunteer Heading" value={settings.getInvolved.volunteerHeading} onChange={(v) => update('getInvolved.volunteerHeading', v)} />
                      <Field label="Volunteer Description" value={settings.getInvolved.volunteerDescription} onChange={(v) => update('getInvolved.volunteerDescription', v)} textarea />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Sponsor Heading" value={settings.getInvolved.sponsorHeading} onChange={(v) => update('getInvolved.sponsorHeading', v)} />
                      <Field label="Sponsor Description" value={settings.getInvolved.sponsorDescription} onChange={(v) => update('getInvolved.sponsorDescription', v)} textarea />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Corporate Heading" value={settings.getInvolved.corporateHeading} onChange={(v) => update('getInvolved.corporateHeading', v)} />
                      <Field label="Corporate Description" value={settings.getInvolved.corporateDescription} onChange={(v) => update('getInvolved.corporateDescription', v)} textarea />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contactpage' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Contact Page</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.contactPage.kicker} onChange={(v) => update('contactPage.kicker', v)} />
                      <Field label="Heading" value={settings.contactPage.heading} onChange={(v) => update('contactPage.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.contactPage.description} onChange={(v) => update('contactPage.description', v)} textarea />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Form Heading" value={settings.contactPage.formHeading} onChange={(v) => update('contactPage.formHeading', v)} />
                      <Field label="Info Heading" value={settings.contactPage.infoHeading} onChange={(v) => update('contactPage.infoHeading', v)} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Social Heading" value={settings.contactPage.socialHeading} onChange={(v) => update('contactPage.socialHeading', v)} />
                      <Field label="FAQ Heading" value={settings.contactPage.faqHeading} onChange={(v) => update('contactPage.faqHeading', v)} />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          {fetchFailed && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
              Could not load the saved settings, so saving is disabled to avoid overwriting them.
            </div>
          )}
          {settingsLoading && (
            <div className="mt-6 rounded-xl border border-dark/10 bg-white px-4 py-3 text-sm text-dark/60 flex items-center gap-2">
              <PiSpinner className="w-4 h-4 animate-spin shrink-0" />
              Loading your saved settings…
            </div>
          )}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={handleSave} disabled={!settingsReady || saving} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-dark text-white font-extrabold text-sm tracking-wide hover:bg-dark-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? <PiSpinner className="w-4 h-4 animate-spin" /> : <PiFloppyDisk className="w-4 h-4" />} {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={handleReset} disabled={!settingsReady} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-dark/20 text-dark font-extrabold text-sm tracking-wide hover:border-dark/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <PiArrowCounterClockwise className="w-4 h-4" /> Reset Section
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
