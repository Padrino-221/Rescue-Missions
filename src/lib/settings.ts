import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const SETTINGS_PATH = join(process.cwd(), 'data', 'settings.json')

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
  cta: { kicker: string; heading: string; description: string }
}

export function getSettings(): SiteSettings {
  try {
    if (existsSync(SETTINGS_PATH)) {
      const raw = readFileSync(SETTINGS_PATH, 'utf-8')
      return JSON.parse(raw)
    }
  } catch {}
  return {} as SiteSettings
}

/**
 * Repair mojibake left behind by bad encoding round-trips so corrupted
 * characters are never persisted back into settings.json.
 */
function sanitizeString(value: string): string {
  return value
    // Cedi sign (₵) mangled into a literal "?" or "C" (or a replacement char) after "GH".
    // Require a following digit so prose like an acronym or a question is never touched.
    .replace(/GH[?C\uFFFD](?=\d)/g, 'GH₵')
    // Any remaining U+FFFD was an em-dash in this content
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

export function saveSettings(settings: SiteSettings): void {
  const cleaned = sanitizeValue(settings) as SiteSettings
  writeFileSync(SETTINGS_PATH, JSON.stringify(cleaned, null, 2))
}
