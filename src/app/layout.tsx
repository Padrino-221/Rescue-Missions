import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rescue Mission Orphanage | Give Hope To Children In Need',
  description: 'A dedicated charity organization focused on creating sustainable solutions for those in need. Join us in our mission to provide education, healthcare, and shelter to orphaned children.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
