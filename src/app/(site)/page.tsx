import { getSettings } from '@/lib/settings'
import Hero from '@/components/Hero'
import ImpactStats from '@/components/ImpactStats'
import ProgramsOverview from '@/components/ProgramsOverview'
import HowWeHelp from '@/components/HowWeHelp'
import Testimonials from '@/components/Testimonials'
import Partners from '@/components/Partners'
import CallToAction from '@/components/CallToAction'

export default async function Home() {
  const settings = await getSettings()

  return (
    <>
      <Hero initialSettings={settings} />
      <ImpactStats initialSettings={settings} />
      <ProgramsOverview initialSettings={settings} />
      <HowWeHelp />
      <Testimonials initialSettings={settings} />
      <Partners initialSettings={settings} />
      <CallToAction initialSettings={settings} />
    </>
  )
}
