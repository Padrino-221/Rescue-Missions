import type { Metadata } from 'next'
import EventsContent from './EventsContent'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Stay updated with Rescue Mission Orphanage events, fundraising galas, community outreach programs, and volunteer opportunities in Ghana.',
  openGraph: {
    title: 'Events | Rescue Mission Orphanage',
    description: 'Stay updated with our latest events, fundraising galas, and community gatherings.',
    url: 'https://rescuemissionsgh.org/events',
  },
}

export default function EventsPage() {
  return <EventsContent />
}
