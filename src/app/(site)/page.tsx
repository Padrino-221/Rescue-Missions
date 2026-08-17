import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import Hero from '@/components/Hero'
import ImpactStats from '@/components/ImpactStats'
import ProgramsOverview from '@/components/ProgramsOverview'
import HowWeHelp from '@/components/HowWeHelp'
import Testimonials from '@/components/Testimonials'
import Partners from '@/components/Partners'
import CallToAction from '@/components/CallToAction'

export const metadata: Metadata = {
  title: 'Rescue Mission Orphanage | Give Hope To Children In Need',
  description: 'Rescue Mission Orphanage provides shelter, education, healthcare, and care to orphaned children in Ghana. Join us in making a difference — donate, volunteer, or sponsor a child today.',
  openGraph: {
    title: 'Rescue Mission Orphanage | Give Hope To Children In Need',
    description: 'Rescue Mission Orphanage provides shelter, education, healthcare, and care to orphaned children in Ghana.',
    url: 'https://rescuemissionsgh.org',
  },
}

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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NonprofitOrganization',
            name: 'Rescue Mission Orphanage',
            url: 'https://rescuemissionsgh.org',
            logo: 'https://rescuemissionsgh.org/favicon.svg',
            description: 'A dedicated charity organization focused on creating sustainable solutions for orphaned children in Ghana through education, healthcare, and shelter.',
            foundingDate: '2025',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Accra',
              addressCountry: 'GH',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+233-256494710',
              contactType: 'customer service',
              email: 'info@rescuemission.org',
            },
            sameAs: [
              'https://facebook.com/rescuemission',
              'https://twitter.com/rescuemission',
              'https://instagram.com/rescuemission',
              'https://youtube.com/rescuemission',
              'https://linkedin.com/company/rescuemission',
            ],
            nonprofitInfo: {
              '@type': 'NonprofitType',
              name: 'Orphanage',
            },
          }),
        }}
      />
    </>
  )
}
