import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import AboutContent from './AboutContent'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const description = settings?.general?.description || 'Learn about our mission, vision, values, and the team dedicated to helping orphaned children in Ghana.'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: 'About Us',
    description: `Learn about ${orgName} \u2014 our mission, vision, values, and the team dedicated to providing education, healthcare, and shelter to orphaned children in Ghana.`,
    openGraph: {
      title: `About Us | ${orgName}`,
      description,
      url: `${siteUrl}/about`,
    },
  }
}

export default async function AboutPage() {
  const settings = await getSettings()
  return <AboutContent initialSettings={settings} />
}
