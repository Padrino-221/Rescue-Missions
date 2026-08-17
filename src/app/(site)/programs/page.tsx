import type { Metadata } from 'next'
import ProgramsContent from './ProgramsContent'

export const metadata: Metadata = {
  title: 'Our Programs',
  description: 'Explore Rescue Mission Orphanage programs — Education, Healthcare, Nutrition, Shelter, Aftercare, and Community support for orphaned children in Ghana.',
  openGraph: {
    title: 'Our Programs | Rescue Mission Orphanage',
    description: 'Explore our Education, Healthcare, Nutrition, Shelter, Aftercare, and Community programs for orphaned children.',
    url: 'https://rescuemissionsgh.org/programs',
  },
}

export default function ProgramsPage() {
  return <ProgramsContent />
}
