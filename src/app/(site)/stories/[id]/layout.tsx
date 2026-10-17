import type { Metadata } from 'next'

// Story detail page is a client component (it can't export metadata), so the
// canonical for /stories/[id] is declared on this segment layout instead.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    alternates: {
      canonical: `/stories/${id}`,
    },
  }
}

export default function StoryDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
