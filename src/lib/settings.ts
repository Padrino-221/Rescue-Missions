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

let settingsTableReady: Promise<void> | null = null

/**
 * Ensures the `site_settings` table exists. Safe to call on every request; the
 * DDL only runs once per process.
 */
function ensureSettingsTable(): Promise<void> {
  if (!settingsTableReady) {
    settingsTableReady = pool
      .query('CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, data JSONB NOT NULL)')
      .then(
        () => undefined,
        (err) => {
          settingsTableReady = null
          throw err
        }
      )
  }
  return settingsTableReady
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    await ensureSettingsTable()
    const rows = await pool.query('SELECT data FROM site_settings WHERE key = $1', ['main'])
    if (rows.rows.length > 0 && rows.rows[0].data) {
      return rows.rows[0].data as SiteSettings
    }
  } catch {}
  return {} as SiteSettings
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Recursively merge `incoming` over `base`. Arrays are replaced wholesale, and
 * keys that only exist in `base` are preserved. This keeps settings that the
 * client edited directly on the deployed site from being wiped out by code
 * updates that don't know about every field.
 */
function deepMerge(
  base: Record<string, unknown>,
  incoming: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(incoming)) {
    if (isPlainObject(value) && isPlainObject(merged[key])) {
      merged[key] = deepMerge(merged[key] as Record<string, unknown>, value)
    } else if (value !== undefined) {
      merged[key] = value
    }
  }
  return merged
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  const cleaned = sanitizeValue(settings) as SiteSettings
  const existing = await getSettings()
  const merged = deepMerge(
    existing as unknown as Record<string, unknown>,
    cleaned as unknown as Record<string, unknown>
  )
  const json = JSON.stringify(merged)
  await pool.query(
    `INSERT INTO site_settings (key, data) VALUES ('main', $1)
     ON CONFLICT (key) DO UPDATE SET data = $1`,
    [json]
  )
}
