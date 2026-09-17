'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PiPhone, PiEnvelope, PiMapPin, PiClock, PiPaperPlaneTilt } from 'react-icons/pi'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import { useSettings } from '@/lib/useSettings'
import { getSocialIcon } from '@/lib/social-icons'
import type { SiteSettings } from '@/lib/settings'

const defaultContactInfo = [
  {
    icon: PiPhone,
    title: 'Phone',
    details: ['+1 (234) 567-890', '+1 (234) 567-891'],
  },
  {
    icon: PiEnvelope,
    title: 'Email',
    details: ['info@rescuemission.org', 'donate@rescuemission.org'],
  },
  {
    icon: PiMapPin,
    title: 'Address',
    details: ['123 Hope Street', 'City, State 12345'],
  },
  {
    icon: PiClock,
    title: 'Office Hours',
    details: ['Mon - Fri: 9:00 AM - 5:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
  },
]

const defaultFaqs = [
  { question: 'How can I volunteer?', answer: 'Visit our Get Involved page or contact us directly to learn about volunteer opportunities.' },
  { question: 'How do I support the organization?', answer: 'Contact us to learn about volunteering, sponsorship, and partnership opportunities.' },
  { question: 'How do I sponsor a child?', answer: 'Contact us to learn about our sponsorship program and how you can make a difference.' },
]

export default function ContactPage({ initialSettings }: { initialSettings?: SiteSettings | null }) {
  const { settings, loading } = useSettings(initialSettings)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const contact = settings?.contact
  const contactInfo = contact
    ? [
        { icon: PiPhone, title: 'Phone', details: [contact.phone1 || '+1 (234) 567-890', contact.phone2 || '+1 (234) 567-891'] },
        { icon: PiEnvelope, title: 'Email', details: [contact.email1 || 'info@rescuemission.org', contact.email2 || 'donate@rescuemission.org'] },
        { icon: PiMapPin, title: 'Address', details: [contact.address1 || '123 Hope Street', contact.address2 || 'City, State 12345'] },
        { icon: PiClock, title: 'Office Hours', details: [contact.officeHours1 || 'Mon - Fri: 9:00 AM - 5:00 PM', contact.officeHours2 || 'Sat: 9:00 AM - 1:00 PM'] },
      ]
    : defaultContactInfo

  const social = settings?.social
  const socialLinks = social?.items?.length
    ? social.items.filter(s => s.url && s.name)
    : []

  const faqs = settings?.faq?.length ? settings.faq : defaultFaqs

  const contactPage = useMemo(() => {
    if (!settings?.contactPage) return {
      kicker: 'Get in Touch',
      heading: 'Contact Us',
      description: "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      formHeading: 'Send us a Message',
      infoHeading: 'Contact Information',
      socialHeading: 'Follow Us',
      faqHeading: 'Frequently Asked Questions',
    }
    return {
      kicker: settings.contactPage.kicker || 'Get in Touch',
      heading: settings.contactPage.heading || 'Contact Us',
      description: settings.contactPage.description || "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      formHeading: settings.contactPage.formHeading || 'Send us a Message',
      infoHeading: settings.contactPage.infoHeading || 'Contact Information',
      socialHeading: settings.contactPage.socialHeading || 'Follow Us',
      faqHeading: settings.contactPage.faqHeading || 'Frequently Asked Questions',
    }
  }, [settings])

  if (loading) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Request failed')
      setSubmitMessage({ type: 'success', text: 'Thank you for your message! We will get back to you soon.' })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setSubmitMessage({ type: 'error', text: 'Sorry, something went wrong. Please try again or email us directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
{/* Hero */}
      <section className="bg-cream pt-24 pb-6 lg:pt-28 lg:pb-8 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-64 h-64 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="kicker mb-6">{contactPage.kicker}</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              {contactPage.heading}
            </h1>
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              {contactPage.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-serif text-dark mb-6">{contactPage.formHeading}</h2>
              <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Your Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <Select
                  label="Subject"
                  placeholder="Select a subject"
                  value={formData.subject}
                  onChange={(val) => setFormData({ ...formData, subject: val })}
                  options={[
                    { label: 'General Inquiry', value: 'General Inquiry' },
                    { label: 'Volunteer Opportunity', value: 'Volunteer Opportunity' },
                    { label: 'Partnership', value: 'Partnership' },
                    { label: 'Media Inquiry', value: 'Media Inquiry' },
                  ]}
                />
                <Textarea
                  label="Message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                />
                {submitMessage && (
                  <p
                    className={`text-sm ${
                      submitMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {submitMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <PiPaperPlaneTilt className="w-5 h-5" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
            
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-serif text-dark mb-6">{contactPage.infoHeading}</h2>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-lime" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-dark/60 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-dark mb-4">{contactPage.socialHeading}</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => {
                    const Icon = getSocialIcon(social.name)
                    return (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-xl border border-dark/20 flex items-center justify-center text-dark/60 hover:bg-dark hover:text-lime hover:border-dark transition-all duration-300"
                        aria-label={social.name}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-dark">{contactPage.faqHeading}</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-6"
              >
                <h3 className="font-semibold text-dark">{faq.question}</h3>
                <p className="mt-2 text-dark/60">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}