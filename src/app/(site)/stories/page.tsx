import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import StoriesContent from './StoriesContent'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: 'Stories',
    description: `Read inspiring stories of transformation from ${orgName}. Learn about success stories, volunteer spotlights, and community impact in Ghana.`,
    openGraph: {
      title: `Stories | ${orgName}`,
      description: 'Read inspiring stories of transformation, events, and community impact.',
      url: `${siteUrl}/stories`,
    },
  }
}

export default async function StoriesPage() {
  const settings = await getSettings()
  return <StoriesContent initialSettings={settings} />
}
