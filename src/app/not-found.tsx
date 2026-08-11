import Link from 'next/link'
import { PiHouse, PiArrowRight } from 'react-icons/pi'

export default function NotFound() {
  return (
    <section className="bg-cream min-h-[70vh] flex items-center relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium py-20 text-center relative">
        <p className="text-8xl md:text-9xl font-serif font-bold text-dark/8 leading-none mb-6">
          404
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">
          Page Not Found
        </h1>
        <p className="text-dark/50 max-w-md mx-auto mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-lime">
            <PiHouse className="w-4 h-4" />
            Back to Home
          </Link>
          <Link href="/about" className="btn-secondary group">
            Learn About Us
            <PiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
