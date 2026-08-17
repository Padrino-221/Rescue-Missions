import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import GalleryContent from './GalleryContent'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse photos and videos from Rescue Mission Orphanage. See our programs, events, and the children we serve in action.',
  openGraph: {
    title: 'Gallery | Rescue Mission Orphanage',
    description: 'Browse photos and videos from Rescue Mission Orphanage programs and events.',
    url: 'https://rescuemissionsgh.org/gallery',
  },
}

export default async function GalleryPage() {
  const settings = await getSettings()
  return <GalleryContent initialSettings={settings} />
}
