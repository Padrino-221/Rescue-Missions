import { getSettings } from '@/lib/settings'
import AboutContent from './AboutContent'

export default async function AboutPage() {
  const settings = await getSettings()
  return <AboutContent initialSettings={settings} />
}
