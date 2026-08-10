import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PiArrowLeft, PiClock, PiUser, PiCaretLeft } from 'react-icons/pi'
import { stories, getStoryById } from '@/lib/stories'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return stories.map((story) => ({ id: String(story.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const story = getStoryById(Number(id))
  if (!story) return { title: 'Story Not Found' }
  return { title: story.title, description: story.excerpt }
}

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const story = getStoryById(Number(id))

  if (!story) notFound()

  const paragraphs = story.content.split('\n\n')

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-40 pb-6 lg:pt-48 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-72 h-72 bg-lime/15 rounded-full blur-3xl" />
        <div className="container-premium">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-dark/50 hover:text-dark transition-colors mb-6"
          >
            <PiCaretLeft className="w-4 h-4" />
            Back to Stories
          </Link>

          <div className="max-w-3xl">
            <span className="pill-tag mb-4">{story.category}</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-serif text-dark leading-tight">
              {story.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-dark/50">
              <span className="flex items-center gap-1.5">
                <PiUser className="w-4 h-4" />
                {story.author}
              </span>
              <span className="flex items-center gap-1.5">
                <PiClock className="w-4 h-4" />
                {story.readTime}
              </span>
              <span>{story.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="bg-cream pb-10">
        <div className="container-premium">
          <div className="relative rounded-[2rem] overflow-hidden aspect-[21/9]">
            <Image
              src={story.image}
              alt={story.title}
              fill
              priority
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="max-w-2xl">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-dark/65 text-[17px] leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-dashed border-dark/10">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-dark font-semibold text-sm hover:gap-3 transition-all"
            >
              <PiArrowLeft className="w-4 h-4" />
              All Stories
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
