import { getSettings } from '@/lib/settings'
import GetInvolvedContent from './GetInvolvedContent'

export default async function GetInvolvedPage() {
  const settings = await getSettings()
  return <GetInvolvedContent initialSettings={settings} />
}
