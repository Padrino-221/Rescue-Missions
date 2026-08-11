import { pool } from './db'

export interface SiteSettings {
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
    tiers: { tier: string; amount: string; benefits: string }[]
    benefits: string[]
  }
  donations: {
    presetAmounts: { amount: number; impact: string }[]
    allocation: { label: string; percentage: number }[]
    taxInfo: string
  }
  faq: { question: string; answer: string }[]
  partners: { name: string }[]
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
