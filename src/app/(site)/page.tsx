import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import Hero from '@/components/Hero'
import ImpactStats from '@/components/ImpactStats'
import ProgramsOverview from '@/components/ProgramsOverview'
import HowWeHelp from '@/components/HowWeHelp'
import FeaturedStory from '@/components/FeaturedStory'
import Testimonials from '@/components/Testimonials'
import Partners from '@/components/Partners'
import CallToAction from '@/components/CallToAction'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const tagline = settings?.general?.tagline || 'Give Hope To Children In Need'
  const description = settings?.general?.description || 'A dedicated charity organization focused on creating sustainable solutions for those in need.'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: `${orgName} | ${tagline}`,
    description,
    openGraph: {
      title: `${orgName} | ${tagline}`,
      description,
      url: siteUrl,
      images: ['/og-image.png'],
    },
  }
}

export default async function Home() {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const tagline = settings?.general?.tagline || 'Give Hope To Children In Need'
  const description = settings?.general?.description || 'A dedicated charity organization focused on creating sustainable solutions for orphaned children in Ghana through education, healthcare, and shelter.'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'
  const foundedYear = settings?.general?.foundedYear || '2025'
  const phone1 = settings?.contact?.phone1 || '+233-24-567-890'
  const email1 = settings?.contact?.email1 || 'info@rescuemission.org'
  const address1 = settings?.contact?.address1 || 'Accra'
  const address2 = settings?.contact?.address2 || 'Ghana'
  const social = settings?.social || {}

  return (
    <>
      <Hero initialSettings={settings} />
      <ImpactStats initialSettings={settings} />
      <ProgramsOverview initialSettings={settings} />
      <HowWeHelp initialSettings={settings} />
      <FeaturedStory initialSettings={settings} />
      <Testimonials initialSettings={settings} />
      <Partners initialSettings={settings} />
      <CallToAction initialSettings={settings} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NonprofitOrganization',
            name: orgName,
            url: siteUrl,
            logo: `${siteUrl}/favicon.svg`,
            description,
            foundingDate: foundedYear,
            address: {
              '@type': 'PostalAddress',
              addressLocality: address1,
              addressCountry: address2,
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: phone1,
              contactType: 'customer service',
              email: email1,
            },
            sameAs: [
              social.facebook,
              social.twitter,
              social.instagram,
              social.youtube,
              social.linkedin,
            ].filter(Boolean),
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
