import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import GalleryContent from './GalleryContent'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: 'Gallery',
    description: `Browse photos and videos from ${orgName}. See our programs, events, and the children we serve in action.`,
    openGraph: {
      title: `Gallery | ${orgName}`,
      description: `Browse photos and videos from ${orgName} programs and events.`,
      url: `${siteUrl}/gallery`,
    },
  }
}

export default async function GalleryPage() {
  const settings = await getSettings()
  return <GalleryContent initialSettings={settings} />
}
