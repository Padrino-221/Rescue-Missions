import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://rescuemissionsgh.org'

export const metadata: Metadata = {
  title: {
    default: 'Rescue Mission Orphanage | Give Hope To Children In Need',
    template: '%s | Rescue Mission Orphanage',
  },
  description: 'A dedicated charity organization focused on creating sustainable solutions for those in need. Join us in our mission to provide education, healthcare, and shelter to orphaned children in Ghana.',
  keywords: ['orphanage', 'charity', 'children', 'education', 'healthcare', 'Ghana', 'donate', 'volunteer', 'nonprofit', 'shelter'],
  authors: [{ name: 'Rescue Mission Orphanage' }],
  creator: 'Rescue Mission Orphanage',
  publisher: 'Rescue Mission Orphanage',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Rescue Mission Orphanage',
    title: 'Rescue Mission Orphanage | Give Hope To Children In Need',
    description: 'A dedicated charity organization focused on creating sustainable solutions for those in need. Join us in our mission to provide education, healthcare, and shelter to orphaned children in Ghana.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rescue Mission Orphanage - Give Hope To Children In Need',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rescue Mission Orphanage | Give Hope To Children In Need',
    description: 'A dedicated charity organization focused on creating sustainable solutions for those in need.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
