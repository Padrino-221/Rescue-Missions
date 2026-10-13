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

// Returns the saved team, or an empty list when nothing is saved yet.
// There is intentionally no demo fallback — empty sections are hidden.
export function resolveTeam(team: TeamMember[] | undefined | null): TeamMember[] {
  return team ?? []
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
