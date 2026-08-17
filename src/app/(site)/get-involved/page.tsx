import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import GetInvolvedContent from './GetInvolvedContent'

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Join Rescue Mission Orphanage as a volunteer, sponsor, or corporate partner. There are many ways to help orphaned children in Ghana receive education, healthcare, and shelter.',
  openGraph: {
    title: 'Get Involved | Rescue Mission Orphanage',
    description: 'Join us as a volunteer, sponsor, or corporate partner to help orphaned children in Ghana.',
    url: 'https://rescuemissionsgh.org/get-involved',
  },
}

export default async function GetInvolvedPage() {
  const settings = await getSettings()
  return <GetInvolvedContent initialSettings={settings} />
}
