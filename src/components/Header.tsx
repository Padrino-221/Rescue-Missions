'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiList, PiX, PiArrowUpRight, PiHeartFill } from 'react-icons/pi'
import { useSettings } from '@/lib/useSettings'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Events', href: '/events' },
  { name: 'Stories', href: '/stories' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { settings, loading } = useSettings()
  const orgName = settings?.general?.orgName || 'Rescue Mission'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-cream/95 backdrop-blur-md py-3 border-b border-dark/10' : 'bg-transparent py-5'
    }`}>
      <nav className="container-premium">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-lime rounded-full flex items-center justify-center transform group-hover:-rotate-6 transition-transform duration-300">
              <PiHeartFill className="w-5 h-5 text-dark" />
            </div>
            <span className="text-lg font-serif font-semibold tracking-tight">
              {loading ? <span className="inline-block w-32 h-5 bg-dark/10 rounded animate-pulse" /> : orgName}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-dark/70 hover:text-dark transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-dark group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/contact" className="btn-lime !py-3 group">
              Contact Us
              <PiArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <PiX className="w-6 h-6" />
            ) : (
              <PiList className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-6 mt-4 bg-white rounded-2xl border-2 border-dark/10">
            <div className="flex flex-col gap-1 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="py-3 px-4 text-dark/80 hover:text-dark hover:bg-cream-100 rounded-xl font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-4 btn-lime justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
                <PiArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}