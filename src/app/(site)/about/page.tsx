import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Rescue Mission Orphanage — our mission, vision, values, and the team dedicated to providing education, healthcare, and shelter to orphaned children in Ghana.',
  openGraph: {
    title: 'About Us | Rescue Mission Orphanage',
    description: 'Learn about our mission, vision, values, and the team dedicated to helping orphaned children in Ghana.',
    url: 'https://rescuemissionsgh.org/about',
  },
}

export default async function AboutPage() {
  const settings = await getSettings()
  return <AboutContent initialSettings={settings} />
}
