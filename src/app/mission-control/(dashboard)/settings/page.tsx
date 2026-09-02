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
} from 'react-icons/pi'
import ImageUpload from '@/components/ui/ImageUpload'
import { useToast } from '@/components/ui/Toast'

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
  fields: { key: string; label: string; textarea?: boolean; image?: boolean }[]
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
                  <ImageUpload value={String(item[f.key] || '')} onChange={(v) => onUpdate(i, f.key, v)} folder={folder} label={f.label} />
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
  general: { orgName: 'Rescue Mission Orphanage', tagline: 'Give Hope To Children In Need', description: 'A dedicated charity organization focused on creating sustainable solutions for those in need. Join us in our mission to provide education, healthcare, and shelter to orphaned children.', foundedYear: '2025', copyrightYear: '2025' },
  siteUrl: 'https://rescuemissionsgh.org',
  contact: { phone1: '+233 24 567 890', phone2: '+233 20 567 891', email1: 'info@rescuemission.org', email2: 'sponsorship@rescuemission.org', address1: '123 Hope Street', address2: 'Accra, Ghana', officeHours1: 'Mon - Fri: 9:00 AM - 5:00 PM', officeHours2: 'Sat: 9:00 AM - 1:00 PM', mediaEmail: 'media@rescuemission.org' },
  social: { items: [
    { name: 'Facebook', url: 'https://facebook.com/rescuemission' },
    { name: 'Twitter', url: 'https://twitter.com/rescuemission' },
    { name: 'Instagram', url: 'https://instagram.com/rescuemission' },
    { name: 'YouTube', url: 'https://youtube.com/rescuemission' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/rescuemission' },
  ] },
  homeHero: { heading: 'Every child deserves a childhood.', description: 'Rescue Mission Orphanage provides shelter, education, and care to children who need it most — turning hardship into hope, one child at a time.', cta1Text: 'Donate Now', cta2Text: 'Explore Our Work', imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80', imageAlt: 'Children playing at Rescue Mission Orphanage' },
  exploreOurWork: {
    kicker: 'Explore Our Work',
    heading: 'Three paths into our mission',
    description: 'Start where you feel most moved — learn who we are, give your time, or follow the journeys of children we serve.',
    items: [
      { index: '01', title: 'Who We Are', subtitle: 'Our Organization', description: 'Learn about our mission, our values, and the communities we serve.', href: '/about', imageUrl: 'https://images.unsplash.com/photo-1497486751826-5bc8bce4f3f6?auto=format&fit=crop&w=900&q=80' },
      { index: '02', title: 'Volunteers', subtitle: 'Take Action', description: 'Join our team of dedicated volunteers making a difference on the ground.', href: '/get-involved', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' },
      { index: '03', title: 'Stories', subtitle: 'Building A Future', description: 'Read inspiring stories of hope, resilience, and transformation.', href: '/stories', imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  cta: { kicker: 'Give Hope a Home', heading: 'Your kindness becomes a child\'s breakthrough', description: 'Every donation, every volunteer hour, every share — it all adds up to education, healthcare, and a safe home for a child in need.' },
  impactStats: { kicker: 'Our Impact', heading: 'Making a Real Difference', description: 'Measurable, lasting change — from classrooms to clinics, every program is built to lift children out of hardship.', stats: [
    { value: '2,500+', label: 'Children Educated', description: 'Through our learning programs' },
    { value: '500+', label: 'Families Supported', description: 'With emergency relief' },
    { value: '15+', label: 'Communities', description: 'Across multiple regions' },
    { value: 'GH₵2.5M', label: 'Funds Raised', description: 'From generous donors' },
  ]},
  howWeHelp: {
    kicker: 'Who We Are',
    heading: 'Driven by compassion, guided by humanity',
    description: 'With compassion at our core, we deliver essential aid to children and families facing hardship.',
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Caregivers spending time with children at the orphanage',
    tags: ['Transparent', 'Emergency Relief', 'Led Action', 'Focused Aid', 'Donors Worldwide'],
    services: [
      { title: 'Education Programs', description: 'Quality teaching, tutoring, and learning resources for every child in our care.' },
      { title: 'Healthcare Support', description: 'Check-ups, vaccinations, and mental-health care that keep children thriving.' },
      { title: 'Safe Shelter', description: 'A warm, secure home where children feel safe enough to simply be kids.' },
    ],
  },
  featuredStory: {
    kicker: 'A Gift of GH₵36',
    heading: 'A steady hand changes everything',
    description: 'Children in poverty deserve more than a second chance. They deserve access to life-changing benefits — medical care, educational support, life skills, and job training — before they graduate into adulthood.',
    imageUrl: 'https://images.unsplash.com/photo-1543338759-8a08e2dbeec9?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Children in a classroom at the orphanage',
    progressBars: [
      { label: 'Education', percentage: 98, color: 'bg-coral' },
      { label: 'Healthcare', percentage: 75, color: 'bg-sky' },
      { label: 'Safe Shelter', percentage: 86, color: 'bg-mint' },
    ],
    quote: 'This place is amazing! Everything about this organization is pleasant. If you want someone to deliver real impact, this is it.',
    quoteAuthor: 'Grace Mwangi',
    quoteRole: 'Program Director',
    quoteAvatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=80&q=80',
  },
  about: { kicker: 'About Us', heading: 'Our Story', heroDescription: 'A journey of hope, dedication, and transformation in the lives of orphaned children since', storyHeading: 'A Journey of Hope Since 2025', storyParagraphs: [
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
  programs: {
    kicker: 'Our Programs',
    heading: 'Comprehensive Support',
    description: 'We offer holistic programs designed to address every aspect of a child\'s development and well-being.',
    ctaHeading: 'Want to Support Our Programs?',
    ctaDescription: 'Contact us to learn how you can support our programs.',
    items: [
      { id: 'education', icon: 'graduation-cap', title: 'Education', subtitle: 'Bright Futures Program', description: 'We believe every child deserves access to quality education. Our education program provides schooling, tutoring, and educational resources to help children reach their full potential.', features: ['Primary & Secondary School Support', 'Tutoring & Homework Help', 'Scholarship Programs', 'Vocational Training'], impact: { beneficiaries: '2,500+', schools: '15', teachers: '50+' }, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80' },
      { id: 'healthcare', icon: 'heart', title: 'Healthcare', subtitle: 'Healthy Hearts Initiative', description: 'Comprehensive healthcare services ensure children receive proper medical care, vaccinations, and health education to thrive physically and mentally.', features: ['Regular Health Check-ups', 'Vaccination Programs', 'Mental Health Support', 'Health Education'], impact: { beneficiaries: '3,000+', clinics: '5', staff: '25+' }, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80' },
      { id: 'nutrition', icon: 'lightning', title: 'Nutrition', subtitle: 'Nourish Hope Program', description: 'Proper nutrition is essential for child development. We provide nutritious meals and nutrition education to ensure healthy growth.', features: ['Daily Nutritious Meals', 'Nutrition Education', 'Supplement Programs', 'Community Gardens'], impact: { meals: '500,000+', gardens: '10', volunteers: '100+' }, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80' },
      { id: 'shelter', icon: 'house', title: 'Shelter', subtitle: 'Safe Haven Project', description: 'Safe, nurturing environments where children can live, grow, and feel secure. Our shelters provide more than just a roof — they provide a home.', features: ['Safe Living Spaces', 'Family-like Environment', 'Recreational Facilities', 'Life Skills Training'], impact: { children: '500+', facilities: '8', caregivers: '40+' }, image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80' },
      { id: 'aftercare', icon: 'gear', title: 'Aftercare', subtitle: 'Future Ready Program', description: 'Supporting children as they transition to independence with job training, mentorship, and ongoing support systems.', features: ['Career Counseling', 'Job Placement Assistance', 'Mentorship Programs', 'Alumni Network'], impact: { graduates: '1,200+', placements: '85%', mentors: '200+' }, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80' },
      { id: 'community', icon: 'users', title: 'Community', subtitle: 'Community Empowerment', description: 'Strengthening communities through awareness programs, parent training, and local partnerships to create sustainable change.', features: ['Parent Workshops', 'Community Outreach', 'Local Partnerships', 'Awareness Campaigns'], impact: { families: '5,000+', events: '100+', partners: '30+' }, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80' },
    ],
  },
  gallery: {
    kicker: 'Gallery',
    heading: 'Media Gallery',
    description: 'Explore photos and videos from our programs, events, and the children we serve.',
    pressHeading: 'Press & Media',
    pressDescription: 'For media inquiries or to download our press kit, please contact our communications team.',
    categories: ['All', 'Events', 'Programs', 'Facilities', 'Children'],
    items: [
      { id: 1, type: 'image', category: 'Events', title: 'Annual Fundraising Gala', alt: 'People gathered at the annual fundraising gala event', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80' },
      { id: 2, type: 'image', category: 'Programs', title: 'Education Program', alt: 'Children participating in the education program', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80' },
      { id: 3, type: 'image', category: 'Children', title: 'Happy Children', alt: 'Smiling children at the orphanage', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80' },
      { id: 4, type: 'video', category: 'Programs', title: 'Healthcare Initiative', alt: 'Healthcare initiative video preview', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80' },
      { id: 5, type: 'image', category: 'Facilities', title: 'New Learning Center', alt: 'The newly constructed learning center', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80' },
      { id: 6, type: 'image', category: 'Events', title: 'Community Outreach', alt: 'Community outreach program in action', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80' },
      { id: 7, type: 'image', category: 'Children', title: 'Graduation Day', alt: 'Children celebrating graduation day', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80' },
      { id: 8, type: 'image', category: 'Programs', title: 'Nutrition Program', alt: 'Children receiving nutritious meals', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80' },
      { id: 9, type: 'video', category: 'Events', title: 'Volunteer Workshop', alt: 'Volunteer training workshop', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' },
      { id: 10, type: 'image', category: 'Facilities', title: 'Playground Area', alt: 'Children playing on the playground', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80' },
      { id: 11, type: 'image', category: 'Children', title: 'Arts & Crafts', alt: 'Children doing arts and crafts activities', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80' },
      { id: 12, type: 'image', category: 'Programs', title: 'Sports Day', alt: 'Children participating in sports day events', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80' },
    ],
  },
  stories: {
    kicker: 'Our Blog',
    heading: 'Stories of Hope',
    description: 'Read inspiring stories of transformation, learn about our events, and stay updated with our latest news.',
    categories: ['All', 'Success Stories', 'Events', 'Announcements', 'Volunteer Spotlights'],
  },
  events: {
    kicker: 'Events',
    heading: 'What\'s Happening',
    description: 'Stay updated with our latest events, drives, and community gatherings.',
  },
  getInvolved: {
    kicker: 'Join Our Mission',
    heading: 'Get Involved',
    description: 'There are many ways you can make a difference in the lives of orphaned children — find the one that fits you.',
    volunteerHeading: 'Volunteer With Us',
    volunteerDescription: 'Join our team of dedicated volunteers and make a direct impact on children\'s lives. Whether you have a few hours or a few weeks, there\'s a role for you.',
    sponsorHeading: 'Sponsor a Child',
    sponsorDescription: 'Your sponsorship provides a child with consistent support for education, healthcare, and daily needs. Build a meaningful connection while changing a life.',
    corporateHeading: 'Corporate Partnerships',
    corporateDescription: 'Partner with us to make a meaningful impact while enhancing your corporate social responsibility profile. We offer flexible partnership options tailored to your goals.',
  },
  contactPage: {
    kicker: 'Get in Touch',
    heading: 'Contact Us',
    description: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    formHeading: 'Send us a Message',
    infoHeading: 'Contact Information',
    socialHeading: 'Follow Us',
    faqHeading: 'Frequently Asked Questions',
  },
  testimonials: {
    kicker: 'Testimonials',
    heading: 'Voices of our community',
    description: 'Donors, volunteers, and partners share what standing with us means to them.',
    items: [
      { quote: 'Supporting Rescue Mission has been one of the most rewarding experiences of my life. Seeing the direct impact on children is incredible.', author: 'Sarah Johnson', role: 'Monthly Donor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
      { quote: 'Volunteering here changed my perspective on life. The dedication of the team and the joy of the children is truly inspiring.', author: 'Michael Chen', role: 'Volunteer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
      { quote: 'As a corporate partner, we have seen firsthand how Rescue Mission transforms communities. Their transparency is unmatched.', author: 'Emily Rodriguez', role: 'Corporate Partner', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
    ],
  },
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
  faq: [
    { question: 'How can I volunteer?', answer: 'Visit our Get Involved page or contact us directly to learn about volunteer opportunities.' },
    { question: 'How do I support the organization?', answer: 'Contact us to learn about volunteering, sponsorship, and partnership opportunities.' },
    { question: 'How do I sponsor a child?', answer: 'Contact us to learn about our sponsorship program and how you can make a difference.' },
  ],
  partners: {
    kicker: 'Trusted by partners & supporters worldwide',
    items: [{ name: 'ZenZap' }, { name: 'sparkle' }, { name: 'Lum Labs' }, { name: 'Pulse' }, { name: 'swift' }, { name: 'innovio' }],
  },
})

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const { settings: serverSettings } = useSettings()
  const { toast } = useToast()

  // Merge server data over defaults once it arrives
  useEffect(() => {
    if (!serverSettings) return
    // Defer to a microtask to avoid synchronously calling setState inside an effect
    queueMicrotask(() => {
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
    try {
      const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
      toast('Failed to save settings', 'error')
    }
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
                    <ImageUpload value={settings.homeHero.imageUrl} onChange={(v) => update('homeHero.imageUrl', v)} folder="rescue-mission/hero" label="Hero Image" />
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
                      <ArrayField items={settings.exploreOurWork.items} onAdd={() => addArrayItem('exploreOurWork.items', { index: '', title: '', subtitle: '', description: '', href: '', imageUrl: '' })} onRemove={(i) => removeArrayItem('exploreOurWork.items', i)} onUpdate={(i, k, v) => updateArrayItem('exploreOurWork.items', i, k, v)} fields={[{ key: 'index', label: 'Index' }, { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' }, { key: 'description', label: 'Description', textarea: true }, { key: 'href', label: 'Link URL' }, { key: 'imageUrl', label: 'Image', image: true }]} folder="rescue-mission/explore" />
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
                    <h2 className="text-lg font-serif text-dark mb-4">Story Section</h2>
                    <div className="space-y-4">
                      <Field label="Story Heading" value={settings.about.storyHeading} onChange={(v) => update('about.storyHeading', v)} />
                      {settings.about.storyParagraphs.map((p: string, i: number) => (
                        <Field key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(v) => updateListItem('about.storyParagraphs', i, v)} textarea />
                      ))}
                      <ImageUpload value={settings.about.storyImageUrl} onChange={(v) => update('about.storyImageUrl', v)} folder="rescue-mission/about" label="Story Image" />
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
                    <ArrayField items={settings.about.team} onAdd={() => addArrayItem('about.team', { name: '', role: '', bio: '', avatar: '' })} onRemove={(i) => removeArrayItem('about.team', i)} onUpdate={(i, k, v) => updateArrayItem('about.team', i, k, v)} fields={[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'bio', label: 'Bio' }, { key: 'avatar', label: 'Avatar', image: true }]} folder="rescue-mission/team" />
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
                  <ArrayField items={settings.testimonials.items} onAdd={() => addArrayItem('testimonials.items', { quote: '', author: '', role: '', avatar: '' })} onRemove={(i) => removeArrayItem('testimonials.items', i)} onUpdate={(i, k, v) => updateArrayItem('testimonials.items', i, k, v)} fields={[{ key: 'quote', label: 'Quote', textarea: true }, { key: 'author', label: 'Author Name' }, { key: 'role', label: 'Role' }, { key: 'avatar', label: 'Avatar', image: true }]} folder="rescue-mission/testimonials" />
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
                    <ImageUpload value={settings.howWeHelp.imageUrl} onChange={(v) => update('howWeHelp.imageUrl', v)} folder="rescue-mission/howwehelp" label="Section Image" />
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
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.featuredStory.kicker} onChange={(v) => update('featuredStory.kicker', v)} />
                      <Field label="Heading" value={settings.featuredStory.heading} onChange={(v) => update('featuredStory.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.featuredStory.description} onChange={(v) => update('featuredStory.description', v)} textarea />
                    <ImageUpload value={settings.featuredStory.imageUrl} onChange={(v) => update('featuredStory.imageUrl', v)} folder="rescue-mission/featured" label="Section Image" />
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
                        <ImageUpload value={settings.featuredStory.quoteAvatar} onChange={(v) => update('featuredStory.quoteAvatar', v)} folder="rescue-mission/featured" label="Author Avatar" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'programs' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Programs Page</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Kicker" value={settings.programs.kicker} onChange={(v) => update('programs.kicker', v)} />
                      <Field label="Heading" value={settings.programs.heading} onChange={(v) => update('programs.heading', v)} />
                    </div>
                    <Field label="Description" value={settings.programs.description} onChange={(v) => update('programs.description', v)} textarea />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="CTA Heading" value={settings.programs.ctaHeading} onChange={(v) => update('programs.ctaHeading', v)} />
                      <Field label="CTA Description" value={settings.programs.ctaDescription} onChange={(v) => update('programs.ctaDescription', v)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-3">Programs</h3>
                      <ArrayField items={settings.programs.items.map((p: Record<string, unknown>) => ({ id: String(p.id || ''), icon: String(p.icon || 'heart'), title: String(p.title || ''), subtitle: String(p.subtitle || ''), description: String(p.description || ''), image: String(p.image || '') }))} onAdd={() => addArrayItem('programs.items', { id: '', icon: 'heart', title: '', subtitle: '', description: '', image: '' })} onRemove={(i) => removeArrayItem('programs.items', i)} onUpdate={(i, k, v) => updateArrayItem('programs.items', i, k, v)} fields={[{ key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' }, { key: 'description', label: 'Description', textarea: true }, { key: 'image', label: 'Image', image: true }]} folder="rescue-mission/programs" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Gallery Page</h2>
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
                    <div>
                      <h3 className="font-semibold text-dark mb-3">Gallery Items</h3>
                      <ArrayField items={settings.gallery.items.map((g: Record<string, unknown>) => ({ id: String(g.id || ''), type: String(g.type || 'image'), category: String(g.category || ''), title: String(g.title || ''), alt: String(g.alt || ''), image: String(g.image || '') }))} onAdd={() => addArrayItem('gallery.items', { id: String(Date.now()), type: 'image', category: '', title: '', alt: '', image: '' })} onRemove={(i) => removeArrayItem('gallery.items', i)} onUpdate={(i, k, v) => updateArrayItem('gallery.items', i, k, v)} fields={[{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'type', label: 'Type (image/video)' }, { key: 'alt', label: 'Alt Text' }, { key: 'image', label: 'Image', image: true }]} folder="rescue-mission/gallery" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stories' && (
                <div className={sectionCls}>
                  <h2 className="text-lg font-serif text-dark mb-4">Stories Page</h2>
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
