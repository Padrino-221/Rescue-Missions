import { getSettings } from '@/lib/settings'
import GalleryContent from './GalleryContent'

export default async function GalleryPage() {
  const settings = await getSettings()
  return <GalleryContent initialSettings={settings} />
}
