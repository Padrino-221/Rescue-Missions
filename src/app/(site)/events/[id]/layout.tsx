import type { Metadata } from 'next'

// Event detail page is a client component (it can't export metadata), so the
// canonical for /events/[id] is declared on this segment layout instead.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    alternates: {
      canonical: `/events/${id}`,
    },
  }
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
