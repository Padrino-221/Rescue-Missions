import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mission Control | Admin',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MissionControlLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
