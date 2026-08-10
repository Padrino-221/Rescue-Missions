'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { PiImageFill, PiPlayFill, PiX } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'

const categories = ['All', 'Events', 'Programs', 'Facilities', 'Children']

const galleryItems = [
  { id: 1, type: 'image', category: 'Events', title: 'Annual Fundraising Gala', alt: 'People gathered at the annual fundraising gala event', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80' },
  { id: 2, type: 'image', category: 'Programs', title: 'Education Program', alt: 'Children participating in the education program', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80' },
  { id: 3, type: 'image', category: 'Children', title: 'Happy Children', alt: 'Smiling children at the orphanage', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80' },
  { id: 4, type: 'video', category: 'Programs', title: 'Healthcare Initiative', alt: 'Healthcare initiative video preview', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80' },
  { id: 5, type: 'image', category: 'Facilities', title: 'New Learning Center', alt: 'The newly constructed learning center', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80' },
  { id: 6, type: 'image', category: 'Events', title: 'Community Outreach', alt: 'Community outreach program in action', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80' },
  { id: 7, type: 'image', category: 'Children', title: 'Graduation Day', alt: 'Children celebrating graduation day', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80' },
  { id: 8, type: 'image', category: 'Programs', title: 'Nutrition Program', alt: 'Children receiving nutritious meals', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80' },
  { id: 9, type: 'video', category: 'Events', title: 'Volunteer Workshop', alt: 'Volunteer training workshop', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' },
  { id: 10, type: 'image', category: 'Facilities', title: 'Playground Area', alt: 'Children playing on the playground', image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80' },
  { id: 11, type: 'image', category: 'Children', title: 'Arts & Crafts', alt: 'Children doing arts and crafts activities', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80' },
  { id: 12, type: 'image', category: 'Programs', title: 'Sports Day', alt: 'Children participating in sports day events', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80' },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const { settings } = useSettings()
  const mediaEmail = settings?.contact?.mediaEmail || 'media@rescuemission.org'

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory)

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

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-40 pb-6 lg:pt-48 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="kicker mb-6">Gallery</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              Media Gallery
            </h1>
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              Explore photos and videos from our programs, events, and the children we serve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
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
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative group cursor-pointer rounded-2xl overflow-hidden border border-dark/10 ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                onClick={() => setSelectedItem(item.id)}
              >
                <div className={`relative ${index % 5 === 0 ? 'h-64 md:h-full' : 'h-48'}`}>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
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
                {item.type === 'video' && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-dark rounded-full flex items-center justify-center border border-white/20">
                    <PiPlayFill className="w-4 h-4 text-lime ml-0.5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedItem && (
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
            <div className="relative aspect-video" role="img" aria-label={galleryItems.find(item => item.id === selectedItem)?.alt}>
              <Image
                src={galleryItems.find(item => item.id === selectedItem)?.image ?? ''}
                alt={galleryItems.find(item => item.id === selectedItem)?.alt ?? ''}
                fill
                className="object-cover"
              />
              {galleryItems.find(item => item.id === selectedItem)?.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark/30">
                  <div className="w-16 h-16 bg-lime rounded-full flex items-center justify-center">
                    <PiPlayFill className="w-8 h-8 text-dark ml-1" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif text-dark">
                {galleryItems.find(item => item.id === selectedItem)?.title}
              </h3>
              <p className="text-dark/60 mt-2">
                {galleryItems.find(item => item.id === selectedItem)?.category}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Press Kit */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-dark mb-6">Press & Media</h2>
          <p className="text-dark/60 mb-8">
            For media inquiries or to download our press kit, please contact our communications team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary">
              Download Press Kit
            </button>
            <a href={`mailto:${mediaEmail}`} className="btn-secondary">
              Contact Media Team
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
