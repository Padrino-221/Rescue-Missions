import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import GetInvolvedContent from './GetInvolvedContent'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: 'Get Involved',
    description: `Join ${orgName} as a volunteer, sponsor, or corporate partner. There are many ways to help orphaned children in Ghana receive education, healthcare, and shelter.`,
    openGraph: {
      title: `Get Involved | ${orgName}`,
      description: `Join us as a volunteer, sponsor, or corporate partner to help orphaned children in Ghana.`,
      url: `${siteUrl}/get-involved`,
    },
  }
}

export default async function GetInvolvedPage() {
  const settings = await getSettings()
  return <GetInvolvedContent initialSettings={settings} />
}
