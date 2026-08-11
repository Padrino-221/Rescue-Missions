'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PiClock, PiUser, PiArrowLeft, PiArrowRight } from 'react-icons/pi'
import { stories, getStoryById } from '@/lib/stories'

export default function StoryDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const story = getStoryById(id)

  if (!story) {
    return (
      <section className="bg-cream pt-40 pb-8 lg:pt-48 lg:pb-10">
        <div className="container-premium text-center py-20">
          <h1 className="text-4xl font-serif text-dark">Story not found</h1>
          <p className="mt-4 text-dark/60">
            The story you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/stories" className="inline-flex items-center gap-2 mt-8 btn-primary">
            <PiArrowLeft className="w-4 h-4" />
            Back to Stories
          </Link>
        </div>
      </section>
    )
  }

  const otherStories = stories.filter((s) => s.id !== story.id).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-40 pb-8 lg:pt-48 lg:pb-10 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 text-dark/60 hover:text-dark transition-colors text-sm font-medium"
              >
                <PiArrowLeft className="w-4 h-4" />
                Back to Stories
              </Link>
              <span className="pill-tag text-xs">{story.category}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif text-dark">
              {story.title}
            </h1>

            <div className="mt-6 flex items-center gap-6 text-sm text-dark/50">
              <span className="flex items-center gap-1">
                <PiUser className="w-4 h-4" />
                {story.author}
              </span>
              <span className="flex items-center gap-1">
                <PiClock className="w-4 h-4" />
                {story.readTime}
              </span>
              <span>{story.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Image */}
      <section className="bg-cream">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-[2rem] overflow-hidden aspect-[21/9]"
          >
            <Image
              src={story.image}
              alt={story.title}
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover object-top"
            />
          </motion.div>
        </div>
      </section>

      {/* Story Content */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xl text-dark/70 leading-relaxed mb-8 font-medium">
                {story.excerpt}
              </p>
              <div className="prose prose-lg max-w-none text-dark/70 leading-relaxed whitespace-pre-wrap">
                {story.content}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Stories */}
      {otherStories.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <h2 className="text-3xl font-serif text-dark mb-8">More Stories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherStories.map((s, index) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/stories/${s.id}`} className="block group">
                    <div className="card-premium overflow-hidden hover:border-dark/30 transition-all duration-300 h-full">
                      <div className="relative h-48">
                        <Image
                          src={s.image}
                          alt={s.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <span className="pill-tag text-xs">{s.category}</span>
                        <h3 className="mt-3 text-lg font-serif text-dark group-hover:text-dark-100 transition-colors">
                          {s.title}
                        </h3>
                        <p className="mt-2 text-dark/60 text-sm line-clamp-2">{s.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between text-sm text-dark/50">
                          <span className="flex items-center gap-1">
                            <PiClock className="w-4 h-4" />
                            {s.readTime}
                          </span>
                          <span className="flex items-center gap-1 text-dark font-medium group-hover:gap-2 transition-all">
                            Read More
                            <PiArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-cream pb-16">
        <div className="container-premium text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 btn-secondary"
            >
              <PiArrowLeft className="w-4 h-4" />
              View All Stories
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
