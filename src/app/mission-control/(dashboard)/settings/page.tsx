'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PiGear,
  PiCheck,
  PiGlobe,
  PiPhone,
  PiEnvelope,
  PiMapPin,
  PiCurrencyCircleDollar,
  PiImage,
  PiShareNetwork,
  PiTrendUp,
  PiHeart,
  PiUsers,
  PiNewspaper,
  PiArrowCounterClockwise,
  PiFloppyDisk,
  PiPlus,
  PiTrash,
} from 'react-icons/pi'

interface Settings {
  general: {
    orgName: string
    tagline: string
    description: string
    foundedYear: string
    copyrightYear: string
  }
  contact: {
    phone1: string
    phone2: string
    email1: string
    email2: string
    address1: string
    address2: string
    officeHours1: string
    officeHours2: string
    mediaEmail: string
  }
  social: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
    linkedin: string
  }
  homeHero: {
    heading: string
    description: string
    cta1Text: string
    cta2Text: string
    imageUrl: string
    imageAlt: string
  }
  impactStats: {
    kicker: string
    heading: string
    description: string
    stats: { value: string; label: string; description: string }[]
  }
  about: {
    storyHeading: string
    storyParagraphs: string[]
    storyImageUrl: string
    missionStatement: string
    visionStatement: string
    values: { title: string; description: string }[]
    team: { name: string; role: string; bio: string; avatar: string }[]
    milestones: { year: string; title: string; description: string }[]
  }
  testimonials: { quote: string; author: string; role: string; avatar: string }[]
  volunteerRoles: { title: string; commitment: string; description: string }[]
  sponsorship: { monthlyAmount: number; benefits: string[] }
  corporate: {
    tiers: { tier: string; amount: string; benefits: string[] }[]
    benefits: string[]
  }
  donations: {
    presetAmounts: { amount: number; impact: string }[]
    allocation: { label: string; percentage: number }[]
    taxInfo: string
  }
  faq: { question: string; answer: string }[]
  partners: { name: string }[]
  cta: { kicker: string; heading: string; description: string }
}

const defaultSettings: Settings = {
  general: { orgName: '', tagline: '', description: '', foundedYear: '', copyrightYear: '' },
  contact: {
    phone1: '',
    phone2: '',
    email1: '',
    email2: '',
    address1: '',
    address2: '',
    officeHours1: '',
    officeHours2: '',
    mediaEmail: '',
  },
  social: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' },
  homeHero: { heading: '', description: '', cta1Text: '', cta2Text: '', imageUrl: '', imageAlt: '' },
  impactStats: { kicker: '', heading: '', description: '', stats: [{ value: '', label: '', description: '' }] },
  about: {
    storyHeading: '',
    storyParagraphs: ['', '', ''],
    storyImageUrl: '',
    missionStatement: '',
    visionStatement: '',
    values: [{ title: '', description: '' }],
    team: [{ name: '', role: '', bio: '', avatar: '' }],
    milestones: [{ year: '', title: '', description: '' }],
  },
  testimonials: [{ quote: '', author: '', role: '', avatar: '' }],
  volunteerRoles: [{ title: '', commitment: '', description: '' }],
  sponsorship: { monthlyAmount: 0, benefits: ['', '', '', '', ''] },
  corporate: {
    tiers: [{ tier: '', amount: '', benefits: [] }],
    benefits: ['', '', '', '', ''],
  },
  donations: {
    presetAmounts: [{ amount: 0, impact: '' }],
    allocation: [{ label: '', percentage: 0 }],
    taxInfo: '',
  },
  faq: [{ question: '', answer: '' }],
  partners: [{ name: '' }],
  cta: { kicker: '', heading: '', description: '' },
}

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {})
  }, [])

  const handleSave = () => {
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
      .then(() => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      })
      .catch(() => {})
  }

  const updateField = (path: string, value: string | number) => {
    setSettings((prev) => {
      const clone = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj: Record<string, any> = clone
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return clone
    })
  }

  const updateArrayField = (
    parentPath: string,
    index: number,
    field: string,
    value: string | number
  ) => {
    setSettings((prev) => {
      const clone = JSON.parse(JSON.stringify(prev))
      const keys = parentPath.split('.')
      let obj: Record<string, any> = clone
      for (const k of keys) obj = obj[k]
      obj[index][field] = value
      return clone
    })
  }

  const addArrayItem = (parentPath: string, template: Record<string, any>) => {
    setSettings((prev) => {
      const clone = JSON.parse(JSON.stringify(prev))
      const keys = parentPath.split('.')
      let obj: Record<string, any> = clone
      for (const k of keys) obj = obj[k]
      obj.push({ ...template })
      return clone
    })
  }

  const removeArrayItem = (parentPath: string, index: number) => {
    setSettings((prev) => {
      const clone = JSON.parse(JSON.stringify(prev))
      const keys = parentPath.split('.')
      let obj: Record<string, any> = clone
      for (const k of keys) obj = obj[k]
      obj.splice(index, 1)
      return clone
    })
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-dark/15 bg-white text-dark text-sm placeholder:text-dark/35 focus:outline-none focus:border-dark/40 transition-colors'
  const textareaClass = inputClass + ' resize-none'

  const renderInput = (
    label: string,
    value: string | number,
    onChange: (val: string | number) => void,
    type: string = 'text'
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-dark mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className={inputClass}
      />
    </div>
  )

  const renderTextarea = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    rows: number = 3
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-dark mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={textareaClass}
        rows={rows}
      />
    </div>
  )

  const renderCard = (title: string, children: React.ReactNode) => (
    <div className="bg-white rounded-2xl border border-dark/10 p-6 mb-4">
      {title && <h3 className="text-dark font-bold text-lg mb-4">{title}</h3>}
      {children}
    </div>
  )

  const renderArraySection = <T extends Record<string, any>>(
    title: string,
    parentPath: string,
    items: T[],
    renderFields: (
      item: T,
      index: number,
      update: (field: string, val: string | number) => void
    ) => React.ReactNode,
    template: T
  ) => (
    <div className="mb-4">
      <h4 className="text-dark font-semibold text-sm mb-3 uppercase tracking-wide">{title}</h4>
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-dark/10 p-6 mb-4 relative"
        >
          <button
            onClick={() => removeArrayItem(parentPath, i)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <PiTrash size={18} />
          </button>
          {renderFields(item, i, (field, val) => updateArrayField(parentPath, i, field, val))}
        </div>
      ))}
      <button
        onClick={() => addArrayItem(parentPath, { ...template })}
        className="flex items-center gap-2 text-dark/60 hover:text-dark text-sm font-medium transition-colors"
      >
        <PiPlus size={16} />
        Add
      </button>
    </div>
  )

  const GeneralTab = () => (
    <div>
      {renderCard('Organization Information', (
        <>
          {renderInput('Organization Name', settings.general.orgName, (v) => updateField('general.orgName', v))}
          {renderInput('Tagline', settings.general.tagline, (v) => updateField('general.tagline', v))}
          {renderTextarea('Description', settings.general.description, (v) => updateField('general.description', v))}
          {renderInput('Founded Year', settings.general.foundedYear, (v) => updateField('general.foundedYear', v))}
          {renderInput('Copyright Year', settings.general.copyrightYear, (v) => updateField('general.copyrightYear', v))}
        </>
      ))}
    </div>
  )

  const ContactTab = () => (
    <div>
      {renderCard('Phone Numbers', (
        <>
          {renderInput('Phone 1', settings.contact.phone1, (v) => updateField('contact.phone1', v))}
          {renderInput('Phone 2', settings.contact.phone2, (v) => updateField('contact.phone2', v))}
        </>
      ))}
      {renderCard('Email Addresses', (
        <>
          {renderInput('Email 1', settings.contact.email1, (v) => updateField('contact.email1', v))}
          {renderInput('Email 2', settings.contact.email2, (v) => updateField('contact.email2', v))}
          {renderInput('Media Email', settings.contact.mediaEmail, (v) => updateField('contact.mediaEmail', v))}
        </>
      ))}
      {renderCard('Address & Hours', (
        <>
          {renderInput('Address 1', settings.contact.address1, (v) => updateField('contact.address1', v))}
          {renderInput('Address 2', settings.contact.address2, (v) => updateField('contact.address2', v))}
          {renderInput('Office Hours 1', settings.contact.officeHours1, (v) => updateField('contact.officeHours1', v))}
          {renderInput('Office Hours 2', settings.contact.officeHours2, (v) => updateField('contact.officeHours2', v))}
        </>
      ))}
    </div>
  )

  const SocialTab = () => (
    <div>
      {renderCard('Social Media Links', (
        <>
          {renderInput('Facebook URL', settings.social.facebook, (v) => updateField('social.facebook', v), 'url')}
          {renderInput('Twitter URL', settings.social.twitter, (v) => updateField('social.twitter', v), 'url')}
          {renderInput('Instagram URL', settings.social.instagram, (v) => updateField('social.instagram', v), 'url')}
          {renderInput('YouTube URL', settings.social.youtube, (v) => updateField('social.youtube', v), 'url')}
          {renderInput('LinkedIn URL', settings.social.linkedin, (v) => updateField('social.linkedin', v), 'url')}
        </>
      ))}
    </div>
  )

  const HomeTab = () => (
    <div>
      {renderCard('Hero Section', (
        <>
          {renderInput('Heading', settings.homeHero.heading, (v) => updateField('homeHero.heading', v))}
          {renderTextarea('Description', settings.homeHero.description, (v) => updateField('homeHero.description', v))}
          {renderInput('CTA 1 Text', settings.homeHero.cta1Text, (v) => updateField('homeHero.cta1Text', v))}
          {renderInput('CTA 2 Text', settings.homeHero.cta2Text, (v) => updateField('homeHero.cta2Text', v))}
          {renderInput('Hero Image URL', settings.homeHero.imageUrl, (v) => updateField('homeHero.imageUrl', v), 'url')}
          {renderInput('Image Alt Text', settings.homeHero.imageAlt, (v) => updateField('homeHero.imageAlt', v))}
        </>
      ))}
      {renderCard('Call to Action', (
        <>
          {renderInput('CTA Kicker', settings.cta.kicker, (v) => updateField('cta.kicker', v))}
          {renderInput('CTA Heading', settings.cta.heading, (v) => updateField('cta.heading', v))}
          {renderTextarea('CTA Description', settings.cta.description, (v) => updateField('cta.description', v))}
        </>
      ))}
    </div>
  )

  const ImpactTab = () => (
    <div>
      {renderCard('Impact Section Header', (
        <>
          {renderInput('Kicker', settings.impactStats.kicker, (v) => updateField('impactStats.kicker', v))}
          {renderInput('Heading', settings.impactStats.heading, (v) => updateField('impactStats.heading', v))}
          {renderTextarea('Description', settings.impactStats.description, (v) => updateField('impactStats.description', v))}
        </>
      ))}
      {renderArraySection(
        'Stats',
        'impactStats.stats',
        settings.impactStats.stats,
        (item, i, update) => (
          <>
            {renderInput('Value', item.value, (v) => update('value', v))}
            {renderInput('Label', item.label, (v) => update('label', v))}
            {renderTextarea('Description', item.description, (v) => update('description', v))}
          </>
        ),
        { value: '', label: '', description: '' }
      )}
    </div>
  )

  const AboutTab = () => (
    <div>
      {renderCard('Story', (
        <>
          {renderInput('Story Heading', settings.about.storyHeading, (v) => updateField('about.storyHeading', v))}
          {renderInput('Story Image URL', settings.about.storyImageUrl, (v) => updateField('about.storyImageUrl', v), 'url')}
          {settings.about.storyParagraphs.map((p, i) =>
            renderTextarea(`Paragraph ${i + 1}`, p, (v) => {
              setSettings((prev) => {
                const clone = JSON.parse(JSON.stringify(prev))
                clone.about.storyParagraphs[i] = v
                return clone
              })
            })
          )}
        </>
      ))}
      {renderCard('Mission & Vision', (
        <>
          {renderTextarea('Mission Statement', settings.about.missionStatement, (v) => updateField('about.missionStatement', v))}
          {renderTextarea('Vision Statement', settings.about.visionStatement, (v) => updateField('about.visionStatement', v))}
        </>
      ))}
      {renderArraySection(
        'Values',
        'about.values',
        settings.about.values,
        (item, i, update) => (
          <>
            {renderInput('Title', item.title, (v) => update('title', v))}
            {renderTextarea('Description', item.description, (v) => update('description', v))}
          </>
        ),
        { title: '', description: '' }
      )}
      {renderArraySection(
        'Team Members',
        'about.team',
        settings.about.team,
        (item, i, update) => (
          <>
            {renderInput('Name', item.name, (v) => update('name', v))}
            {renderInput('Role', item.role, (v) => update('role', v))}
            {renderTextarea('Bio', item.bio, (v) => update('bio', v))}
            {renderInput('Avatar URL', item.avatar, (v) => update('avatar', v), 'url')}
          </>
        ),
        { name: '', role: '', bio: '', avatar: '' }
      )}
      {renderArraySection(
        'Milestones',
        'about.milestones',
        settings.about.milestones,
        (item, i, update) => (
          <>
            {renderInput('Year', item.year, (v) => update('year', v))}
            {renderInput('Title', item.title, (v) => update('title', v))}
            {renderTextarea('Description', item.description, (v) => update('description', v))}
          </>
        ),
        { year: '', title: '', description: '' }
      )}
    </div>
  )

  const TestimonialsTab = () =>
    renderArraySection(
      'Testimonials',
      'testimonials',
      settings.testimonials,
      (item, i, update) => (
        <>
          {renderTextarea('Quote', item.quote, (v) => update('quote', v))}
          {renderInput('Author', item.author, (v) => update('author', v))}
          {renderInput('Role', item.role, (v) => update('role', v))}
          {renderInput('Avatar URL', item.avatar, (v) => update('avatar', v), 'url')}
        </>
      ),
      { quote: '', author: '', role: '', avatar: '' }
    )

  const VolunteerTab = () => (
    <div>
      {renderArraySection(
        'Volunteer Roles',
        'volunteerRoles',
        settings.volunteerRoles,
        (item, i, update) => (
          <>
            {renderInput('Title', item.title, (v) => update('title', v))}
            {renderInput('Commitment', item.commitment, (v) => update('commitment', v))}
            {renderTextarea('Description', item.description, (v) => update('description', v))}
          </>
        ),
        { title: '', commitment: '', description: '' }
      )}
      {renderCard('Sponsorship', (
        <>
          {renderInput('Monthly Amount', settings.sponsorship.monthlyAmount, (v) => updateField('sponsorship.monthlyAmount', v), 'number')}
          {settings.sponsorship.benefits.map((b, i) =>
            renderInput(`Benefit ${i + 1}`, b, (v) => {
              setSettings((prev) => {
                const clone = JSON.parse(JSON.stringify(prev))
                clone.sponsorship.benefits[i] = v
                return clone
              })
            })
          )}
        </>
      ))}
    </div>
  )

  const CorporateTab = () => (
    <div>
      {renderArraySection(
        'Corporate Tiers',
        'corporate.tiers',
        settings.corporate.tiers,
        (item, i, update) => (
          <>
            {renderInput('Tier Name', item.tier, (v) => update('tier', v))}
            {renderInput('Amount', item.amount, (v) => update('amount', v))}
            {item.benefits.map((b, j) =>
              renderInput(`Benefit ${j + 1}`, b, (v) => {
                setSettings((prev) => {
                  const clone = JSON.parse(JSON.stringify(prev))
                  clone.corporate.tiers[i].benefits[j] = v
                  return clone
                })
              })
            )}
          </>
        ),
        { tier: '', amount: '', benefits: [] }
      )}
      {renderCard('Corporate Benefits', (
        <>
          {settings.corporate.benefits.map((b, i) =>
            renderInput(`Benefit ${i + 1}`, b, (v) => {
              setSettings((prev) => {
                const clone = JSON.parse(JSON.stringify(prev))
                clone.corporate.benefits[i] = v
                return clone
              })
            })
          )}
        </>
      ))}
    </div>
  )

  const DonationsTab = () => (
    <div>
      {renderArraySection(
        'Preset Amounts',
        'donations.presetAmounts',
        settings.donations.presetAmounts,
        (item, i, update) => (
          <>
            {renderInput('Amount', item.amount, (v) => update('amount', v), 'number')}
            {renderInput('Impact Text', item.impact, (v) => update('impact', v))}
          </>
        ),
        { amount: 0, impact: '' }
      )}
      {renderArraySection(
        'Donation Allocation',
        'donations.allocation',
        settings.donations.allocation,
        (item, i, update) => (
          <>
            {renderInput('Label', item.label, (v) => update('label', v))}
            {renderInput('Percentage', item.percentage, (v) => update('percentage', v), 'number')}
          </>
        ),
        { label: '', percentage: 0 }
      )}
      {renderCard('Tax Information', (
        renderTextarea('Tax Information', settings.donations.taxInfo, (v) => updateField('donations.taxInfo', v), 5)
      ))}
    </div>
  )

  const FaqTab = () => (
    <div>
      {renderArraySection(
        'FAQ',
        'faq',
        settings.faq,
        (item, i, update) => (
          <>
            {renderInput('Question', item.question, (v) => update('question', v))}
            {renderTextarea('Answer', item.answer, (v) => update('answer', v))}
          </>
        ),
        { question: '', answer: '' }
      )}
      {renderArraySection(
        'Partners',
        'partners',
        settings.partners,
        (item, i, update) => (
          renderInput('Name', item.name, (v) => update('name', v))
        ),
        { name: '' }
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />
      case 'contact':
        return <ContactTab />
      case 'social':
        return <SocialTab />
      case 'home':
        return <HomeTab />
      case 'impact':
        return <ImpactTab />
      case 'about':
        return <AboutTab />
      case 'testimonials':
        return <TestimonialsTab />
      case 'volunteer':
        return <VolunteerTab />
      case 'corporate':
        return <CorporateTab />
      case 'donations':
        return <DonationsTab />
      case 'faq':
        return <FaqTab />
      default:
        return <GeneralTab />
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fbf6] p-6 lg:p-10">
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-[#7ed957] text-[#0e3b2b] px-6 py-3 rounded-xl font-semibold shadow-lg z-50 flex items-center gap-2"
        >
          <PiCheck size={18} />
          Settings saved successfully!
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-dark font-extrabold text-3xl mb-8">Site Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tab Navigation */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:w-56 shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#0e3b2b] text-white'
                      : 'text-[#0e3b2b]/60 hover:bg-[#0e3b2b]/5'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            {renderTabContent()}

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#0e3b2b] text-white rounded-full px-8 py-3.5 font-extrabold text-sm hover:opacity-90 transition-opacity"
              >
                <PiFloppyDisk size={18} />
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
