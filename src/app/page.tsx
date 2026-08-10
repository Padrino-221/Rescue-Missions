import Hero from '@/components/Hero'
import ImpactStats from '@/components/ImpactStats'
import ProgramsOverview from '@/components/ProgramsOverview'
import HowWeHelp from '@/components/HowWeHelp'
import Testimonials from '@/components/Testimonials'
import CallToAction from '@/components/CallToAction'

export default function Home() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <ProgramsOverview />
      <HowWeHelp />
      <Testimonials />
      <CallToAction />
    </>
  )
}
