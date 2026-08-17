import type { Metadata } from 'next'
import StoriesContent from './StoriesContent'

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Read inspiring stories of transformation from Rescue Mission Orphanage. Learn about success stories, volunteer spotlights, and community impact in Ghana.',
  openGraph: {
    title: 'Stories | Rescue Mission Orphanage',
    description: 'Read inspiring stories of transformation, events, and community impact.',
    url: 'https://rescuemissionsgh.org/stories',
  },
}

export default function StoriesPage() {
  return <StoriesContent />
}
