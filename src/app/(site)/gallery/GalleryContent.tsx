'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { PiImageFill, PiPlayFill, PiX } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'
import type { SiteSettings } from '@/lib/settings'

export function youtubeId(url: string | undefined): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  return match ? match[1] : null
}

export function youtubeThumb(url: string | undefined): string | null {
  const id = youtubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

export default function GalleryPage({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState<number | string | null>(null)
  const { settings, loading } = useSettings(initialSettings)
  const mediaEmail = settings?.contact?.mediaEmail || ''

  const saved = settings?.gallery
  const gallerySettings = saved
    ? {
        kicker: saved.kicker || '',
        heading: saved.heading || '',
        description: saved.description || '',
        pressHeading: saved.pressHeading || '',
        pressDescription: saved.pressDescription || '',
        categories: saved.categories ?? [],
        items: saved.items ?? [],
      }
    : null

  const filteredItems = !gallerySettings
    ? []
    : activeCategory === 'All'
      ? gallerySettings.items
      : gallerySettings.items.filter(item => item.category === activeCategory)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null)
    }
    window.addEventListener('keydown', handleEscape)
    if (selectedItem) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedItem])

  if (loading) return null
  if (!gallerySettings) return null
  const hasHero = Boolean(gallerySettings.kicker || gallerySettings.heading || gallerySettings.description)
  const hasPress = Boolean(gallerySettings.pressHeading || gallerySettings.pressDescription)

  return (
    <>
      {/* Hero */}
      {hasHero && (
      <section className="bg-cream pt-24 pb-6 lg:pt-28 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {gallerySettings.kicker && <span className="kicker mb-6">{gallerySettings.kicker}</span>}
            {gallerySettings.heading && (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              {gallerySettings.heading}
            </h1>
            )}
            {gallerySettings.description && (
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              {gallerySettings.description}
            </p>
            )}
          </motion.div>
        </div>
      </section>
      )}

      {/* Gallery */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {gallerySettings.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pill-tag ${
                  activeCategory === category
                    ? 'pill-tag-active'
                    : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item, index) => {
              const thumb = item.image || youtubeThumb(item.videoUrl) || ''
              return (
              <motion.div
                key={String(item.id ?? `${item.title}-${index}`)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden border border-dark/10 ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => setSelectedItem(item.id)}
              >
                <div className={`relative bg-dark/5 ${index % 5 === 0 ? 'h-64 md:h-full' : 'h-48'}`}>
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={item.alt || item.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/70 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white">
                    {item.type === 'video' ? (
                      <PiPlayFill className="w-12 h-12 mx-auto mb-2" />
                    ) : (
                      <PiImageFill className="w-12 h-12 mx-auto mb-2" />
                    )}
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-white/70">{item.category}</p>
                  </div>
                </div>
                
                {/* Video indicator */}
                {(item.type === 'video' || youtubeId(item.videoUrl)) && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-dark rounded-full flex items-center justify-center border border-white/20">
                    <PiPlayFill className="w-4 h-4 text-lime ml-0.5" />
                  </div>
                )}
              </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem !== null && (
        <div
          className="fixed inset-0 bg-dark/95 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            <PiX className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const active = gallerySettings.items.find((item) => String(item.id) === String(selectedItem))
              const videoId = youtubeId(active?.videoUrl)
              return (
                <>
                  <div className="relative aspect-video bg-dark/5" role="img" aria-label={active?.alt}>
                    {videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        title={active?.title ?? 'Video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <>
                        {active?.image && (
                          <Image
                            src={active.image}
                            alt={active.alt ?? ''}
                            fill
                            className="object-cover object-top"
                          />
                        )}
                        {active?.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-dark/30">
                            <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center">
                              <PiPlayFill className="w-8 h-8 text-dark ml-1" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-serif text-dark">
                      {active?.title}
                    </h3>
                    <p className="text-dark/60 mt-2">
                      {active?.category}
                    </p>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Press Kit */}
      {hasPress && (
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {gallerySettings.pressHeading && <h2 className="text-3xl font-serif text-dark mb-6">{gallerySettings.pressHeading}</h2>}
          {gallerySettings.pressDescription && (
          <p className="text-dark/60 mb-8">
            {gallerySettings.pressDescription}
          </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary">
              Download Press Kit
            </button>
            {mediaEmail && (
            <a href={`mailto:${mediaEmail}`} className="btn-secondary">
              Contact Media Team
            </a>
            )}
          </div>
        </div>
      </section>
      )}
    </>
  )
}
