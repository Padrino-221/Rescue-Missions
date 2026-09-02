import type { Metadata } from 'next'
import { getSettings } from '@/lib/settings'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const tagline = settings?.general?.tagline || 'Give Hope To Children In Need'
  const description = settings?.general?.description || 'A dedicated charity organization focused on creating sustainable solutions for those in need. Join us in our mission to provide education, healthcare, and shelter to orphaned children in Ghana.'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    title: {
      default: `${orgName} | ${tagline}`,
      template: `%s | ${orgName}`,
    },
    description,
    keywords: ['orphanage', 'charity', 'children', 'education', 'healthcare', 'Ghana', 'donate', 'volunteer', 'nonprofit', 'shelter'],
    authors: [{ name: orgName }],
    creator: orgName,
    publisher: orgName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: orgName,
      title: `${orgName} | ${tagline}`,
      description,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${orgName} - ${tagline}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${orgName} | ${tagline}`,
      description,
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.svg',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
