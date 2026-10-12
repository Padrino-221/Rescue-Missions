export function teamSlug(name: string, index?: number): string {
  const slug = (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (slug) return slug
  return `member-${(index ?? 0) + 1}`
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  avatar: string
}

// Same fallback the About page cards use when no team is saved yet
// (e.g. local dev with an empty database). The detail page must resolve
// against the same list, otherwise cards link to slugs it can't find → 404.
export const defaultTeam: TeamMember[] = [
  { name: 'Grace Mwangi', role: 'Executive Director', bio: '20+ years in nonprofit leadership', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80' },
  { name: 'David Okonkwo', role: 'Programs Director', bio: 'Expert in child development programs', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
  { name: 'Sarah Williams', role: 'Development Manager', bio: 'Passionate about community engagement', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
  { name: 'James Chen', role: 'Finance Director', bio: 'Ensuring transparent financial stewardship', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
]

export function resolveTeam(team: TeamMember[] | undefined | null): TeamMember[] {
  return team?.length ? team : defaultTeam
}

export function findTeamMember(
  team: TeamMember[],
  slug: string
): { member: TeamMember; index: number } | null {
  const decoded = decodeURIComponent(slug)
  const bySlug = team.findIndex((m, i) => teamSlug(m.name, i) === decoded)
  if (bySlug >= 0) return { member: team[bySlug], index: bySlug }
  const byFallback = team.findIndex((_, i) => `member-${i + 1}` === decoded)
  if (byFallback >= 0) return { member: team[byFallback], index: byFallback }
  return null
}
