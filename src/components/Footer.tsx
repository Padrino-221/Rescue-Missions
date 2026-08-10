'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PiHeartFill, PiEnvelope, PiPhone, PiMapPin, PiFacebookLogo, PiTwitterLogo, PiInstagramLogo, PiYoutubeLogo, PiLinkedinLogo } from 'react-icons/pi'

const footerLinks = [
  { name: 'Our Story', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Donate', href: '/donate' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Contact', href: '/contact' },
  { name: 'Gallery', href: '/gallery' },
]

interface Settings {
  general?: {
    orgName?: string
    description?: string
    tagline?: string
    copyrightYear?: string
  }
  contact?: {
    phone1?: string
    email1?: string
    address1?: string
    address2?: string
  }
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings(null))
  }, [])

  const orgName = settings?.general?.orgName || 'Rescue Mission'
  const tagline = settings?.general?.tagline || ''
  const description = settings?.general?.description || 'Creating sustainable solutions for children in need — empowering them to build a better future.'
  const phone = settings?.contact?.phone1 || '+1 (234) 567-890'
  const email = settings?.contact?.email1 || 'info@rescuemission.org'
  const address1 = settings?.contact?.address1 || ''
  const address2 = settings?.contact?.address2 || ''
  const fullAddress = [address1, address2].filter(Boolean).join(', ') || '123 Hope Street, City, Country'
  const copyrightYear = settings?.general?.copyrightYear || '2024'

  const socialLinks = [
    { name: 'Facebook', icon: PiFacebookLogo, href: settings?.social?.facebook || '#' },
    { name: 'Twitter', icon: PiTwitterLogo, href: settings?.social?.twitter || '#' },
    { name: 'Instagram', icon: PiInstagramLogo, href: settings?.social?.instagram || '#' },
    { name: 'YouTube', icon: PiYoutubeLogo, href: settings?.social?.youtube || '#' },
    { name: 'LinkedIn', icon: PiLinkedinLogo, href: settings?.social?.linkedin || '#' },
  ]

  return (
    <footer className="bg-dark">
      <div className="container-premium py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-lime rounded-full flex items-center justify-center">
                <PiHeartFill className="w-4 h-4 text-dark" />
              </div>
              <span className="text-base font-serif font-semibold text-cream">{orgName}</span>
            </Link>
            {tagline && (
              <p className="text-xs text-cream/40 italic mb-5 -mt-2">{tagline}</p>
            )}
            <p className="text-cream/45 text-sm max-w-xs leading-relaxed mb-5">
              {description}
            </p>
            <div className="space-y-2.5 text-sm">
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2.5 text-cream/45 hover:text-lime transition-colors">
                <PiPhone className="w-4 h-4" /> {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-cream/45 hover:text-lime transition-colors">
                <PiEnvelope className="w-4 h-4" /> {email}
              </a>
              <div className="flex items-center gap-2.5 text-cream/45">
                <PiMapPin className="w-4 h-4" /> {fullAddress}
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-cream/35 font-semibold mb-4">Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-cream/50 hover:text-lime transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-cream/35 font-semibold mb-4">Follow Us</h4>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-cream/45 hover:bg-lime hover:text-dark hover:border-lime transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/8">
        <div className="container-premium py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-cream/30 text-xs">&copy; {copyrightYear} {orgName}. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-cream/30">
            <Link href="/about" className="hover:text-cream/60 transition-colors">Privacy</Link>
            <Link href="/about" className="hover:text-cream/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
