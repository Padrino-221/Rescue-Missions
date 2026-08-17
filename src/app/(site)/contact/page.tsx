import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Rescue Mission Orphanage. Reach out for volunteer opportunities, donations, partnerships, or any inquiries about our programs for orphaned children.',
  openGraph: {
    title: 'Contact Us | Rescue Mission Orphanage',
    description: 'Get in touch with Rescue Mission Orphanage for volunteer opportunities, donations, and partnerships.',
    url: 'https://rescuemissionsgh.org/contact',
  },
}

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactContent initialSettings={settings} />
}
