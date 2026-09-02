import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import ContactContent from './ContactContent'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: 'Contact Us',
    description: `Get in touch with ${orgName}. Reach out for volunteer opportunities, donations, partnerships, or any inquiries about our programs for orphaned children.`,
    openGraph: {
      title: `Contact Us | ${orgName}`,
      description: `Get in touch with ${orgName} for volunteer opportunities, donations, and partnerships.`,
      url: `${siteUrl}/contact`,
    },
  }
}

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactContent initialSettings={settings} />
}
