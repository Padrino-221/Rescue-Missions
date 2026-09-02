import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import EventsContent from './EventsContent'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: 'Events',
    description: `Stay updated with ${orgName} events, fundraising galas, community outreach programs, and volunteer opportunities in Ghana.`,
    openGraph: {
      title: `Events | ${orgName}`,
      description: `Stay updated with our latest events, fundraising galas, and community gatherings.`,
      url: `${siteUrl}/events`,
    },
  }
}

export default async function EventsPage() {
  const settings = await getSettings()
  return <EventsContent initialSettings={settings} />
}
