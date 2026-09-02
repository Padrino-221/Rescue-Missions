import { pool } from './db'

export interface SiteSettings {
  general: {
    orgName: string
    tagline: string
    description: string
    foundedYear: string
    copyrightYear: string
  }
  siteUrl: string
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
    items: { name: string; url: string }[]
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
  howWeHelp: {
    kicker: string
    heading: string
    description: string
    imageUrl: string
    imageAlt: string
    tags: string[]
    services: { title: string; description: string }[]
  }
  featuredStory: {
    kicker: string
    heading: string
    description: string
    imageUrl: string
    imageAlt: string
    progressBars: { label: string; percentage: number; color: string }[]
    quote: string
    quoteAuthor: string
    quoteRole: string
    quoteAvatar: string
  }
  about: {
    kicker: string
    heading: string
    heroDescription: string
    storyHeading: string
    storyParagraphs: string[]
    storyImageUrl: string
    missionStatement: string
    visionStatement: string
    values: { title: string; description: string }[]
    team: { name: string; role: string; bio: string; avatar: string }[]
    milestones: { year: string; title: string; description: string }[]
  }
  programs: {
    kicker: string
    heading: string
    description: string
    ctaHeading: string
    ctaDescription: string
    items: {
      id: string
      icon: string
      title: string
      subtitle: string
      description: string
      features: string[]
      impact: Record<string, string>
      image: string
    }[]
  }
  gallery: {
    kicker: string
    heading: string
    description: string
    pressHeading: string
    pressDescription: string
    categories: string[]
    items: { id: number; type: string; category: string; title: string; alt: string; image: string }[]
  }
  stories: {
    kicker: string
    heading: string
    description: string
    categories: string[]
  }
  events: {
    kicker: string
    heading: string
    description: string
  }
  getInvolved: {
    kicker: string
    heading: string
    description: string
    volunteerHeading: string
    volunteerDescription: string
    sponsorHeading: string
    sponsorDescription: string
    corporateHeading: string
    corporateDescription: string
  }
  contactPage: {
    kicker: string
    heading: string
    description: string
    formHeading: string
    infoHeading: string
    socialHeading: string
    faqHeading: string
  }
  testimonials: {
    kicker: string
    heading: string
    description: string
    items: { quote: string; author: string; role: string; avatar: string }[]
  }
  volunteerRoles: { title: string; commitment: string; description: string }[]
  sponsorship: { monthlyAmount: number; benefits: string[] }
  corporate: {
    tiers: { tier: string; amount: string; benefits: string }[]
    benefits: string[]
  }
  faq: { question: string; answer: string }[]
  partners: {
    kicker: string
    items: { name: string }[]
  }
  exploreOurWork: {
    kicker: string
    heading: string
    description: string
    items: {
      index: string
      title: string
      subtitle: string
      description: string
      href: string
      imageUrl: string
    }[]
  }
  cta: { kicker: string; heading: string; description: string }
}

function sanitizeString(value: string): string {
  return value
    .replace(/GH[?C\uFFFD](?=\d)/g, 'GH₵')
    .replace(/\uFFFD/g, '—')
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') return sanitizeString(value)
  if (Array.isArray(value)) return value.map(sanitizeValue)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, sanitizeValue(val)])
    )
  }
  return value
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await pool.query('SELECT data FROM site_settings WHERE key = $1', ['main'])
    if (rows.rows.length > 0 && rows.rows[0].data) {
      return rows.rows[0].data as SiteSettings
    }
  } catch {}
  return {} as SiteSettings
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  const cleaned = sanitizeValue(settings) as SiteSettings
  const json = JSON.stringify(cleaned)
  await pool.query(
    `INSERT INTO site_settings (key, data) VALUES ('main', $1)
     ON CONFLICT (key) DO UPDATE SET data = $1`,
    [json]
  )
}
