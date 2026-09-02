/**
 * Migrate site_settings to the new schema.
 *
 * Reads the current settings from the database, merges in all new fields
 * (preserving any values the client has already changed), and saves back.
 *
 * Safe to re-run — it never overwrites existing values.
 *
 * Usage:  node scripts/migrate-settings.mjs
 */
import pg from 'pg'
const { Client } = pg

const c = new Client({
  host: 'ep-crimson-thunder-ayvdckx1-pooler.c-5.us-east-2.aws.neon.tech',
  port: 5432,
  user: 'neondb_owner',
  password: 'npg_mZb2xDNrC1kE',
  database: 'neondb',
  ssl: { rejectUnauthorized: false }
})

// Full default settings — every field the new code expects
const FULL_DEFAULTS = {
  general: { orgName: 'Rescue Mission Orphanage', tagline: 'Give Hope To Children In Need', description: 'A dedicated charity organization focused on creating sustainable solutions for those in need. Join us in our mission to provide education, healthcare, and shelter to orphaned children.', foundedYear: '2025', copyrightYear: '2025' },
  siteUrl: 'https://rescuemissionsgh.org',
  contact: { phone1: '+233 24 567 890', phone2: '+233 20 567 891', email1: 'info@rescuemission.org', email2: 'sponsorship@rescuemission.org', address1: '123 Hope Street', address2: 'Accra, Ghana', officeHours1: 'Mon - Fri: 9:00 AM - 5:00 PM', officeHours2: 'Sat: 9:00 AM - 1:00 PM', mediaEmail: 'media@rescuemission.org' },
  social: { facebook: 'https://facebook.com/rescuemission', twitter: 'https://twitter.com/rescuemission', instagram: 'https://instagram.com/rescuemission', youtube: 'https://youtube.com/rescuemission', linkedin: 'https://linkedin.com/company/rescuemission' },
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
  cta: { kicker: 'Give Hope a Home', heading: "Your kindness becomes a child's breakthrough", description: 'Every donation, every volunteer hour, every share — it all adds up to education, healthcare, and a safe home for a child in need.' },
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
    description: "We offer holistic programs designed to address every aspect of a child's development and well-being.",
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
    heading: "What's Happening",
    description: 'Stay updated with our latest events, drives, and community gatherings.',
  },
  getInvolved: {
    kicker: 'Join Our Mission',
    heading: 'Get Involved',
    description: 'There are many ways you can make a difference in the lives of orphaned children — find the one that fits you.',
    volunteerHeading: 'Volunteer With Us',
    volunteerDescription: "Join our team of dedicated volunteers and make a direct impact on children's lives. Whether you have a few hours or a few weeks, there's a role for you.",
    sponsorHeading: 'Sponsor a Child',
    sponsorDescription: 'Your sponsorship provides a child with consistent support for education, healthcare, and daily needs. Build a meaningful connection while changing a life.',
    corporateHeading: 'Corporate Partnerships',
    corporateDescription: 'Partner with us to make a meaningful impact while enhancing your corporate social responsibility profile. We offer flexible partnership options tailored to your goals.',
  },
  contactPage: {
    kicker: 'Get in Touch',
    heading: 'Contact Us',
    description: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
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
}

/**
 * Deep merge: fills in missing keys from source into target,
 * never overwrites existing values.
 */
function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null) return target
  if (typeof source !== 'object' || source === null) return target

  if (Array.isArray(source)) {
    if (!Array.isArray(target) || target.length === 0) return source
    return target
  }

  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (!(key in result) || result[key] === undefined || result[key] === null || result[key] === '') {
      result[key] = source[key]
    } else if (typeof result[key] === 'object' && typeof source[key] === 'object') {
      result[key] = deepMerge(result[key], source[key])
    }
  }
  return result
}

/**
 * Handle the old flat testimonials/partners structure -> new nested structure
 */
function migrateOldStructure(data) {
  // Old: testimonials was a flat array -> new: { kicker, heading, description, items }
  if (Array.isArray(data.testimonials)) {
    data.testimonials = {
      kicker: 'Testimonials',
      heading: 'Voices of our community',
      description: 'Donors, volunteers, and partners share what standing with us means to them.',
      items: data.testimonials,
    }
  }

  // Old: partners was a flat array -> new: { kicker, items }
  if (Array.isArray(data.partners)) {
    data.partners = {
      kicker: 'Trusted by partners & supporters worldwide',
      items: data.partners,
    }
  }

  return data
}

async function main() {
  await c.connect()
  console.log('Connected to Neon database')

  // Read current settings
  const res = await c.query('SELECT data FROM site_settings WHERE key = $1', ['main'])
  const current = res.rows.length > 0 && res.rows[0].data ? res.rows[0].data : {}
  console.log('Current settings keys:', Object.keys(current))

  // Migrate old structures
  const migrated = migrateOldStructure({ ...current })

  // Deep merge: current values take priority, new fields get defaults
  const merged = deepMerge(migrated, FULL_DEFAULTS)

  // Save back
  await c.query(
    `INSERT INTO site_settings (key, data) VALUES ('main', $1)
     ON CONFLICT (key) DO UPDATE SET data = $1`,
    [JSON.stringify(merged)]
  )

  console.log('Migrated settings keys:', Object.keys(merged))
  console.log('Done! Settings updated with new schema.')

  await c.end()
}

main().catch(e => { console.error('Migration failed:', e.message); process.exit(1) })
