import { getSettings } from '@/lib/settings'
import ContactContent from './ContactContent'

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactContent initialSettings={settings} />
}
