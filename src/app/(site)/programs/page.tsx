import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import ProgramsContent from './ProgramsContent'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: 'Our Programs',
    description: `Explore ${orgName} programs \u2014 Education, Healthcare, Nutrition, Shelter, Aftercare, and Community support for orphaned children in Ghana.`,
    openGraph: {
      title: `Our Programs | ${orgName}`,
      description: `Explore our Education, Healthcare, Nutrition, Shelter, Aftercare, and Community programs for orphaned children.`,
      url: `${siteUrl}/programs`,
    },
  }
}

export default async function ProgramsPage() {
  const settings = await getSettings()
  return <ProgramsContent initialSettings={settings} />
}
