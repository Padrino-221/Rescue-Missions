'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PiGraduationCap, PiHeart, PiHouse, PiGear, PiLightning, PiUsers, PiArrowRight } from 'react-icons/pi'

const programs = [
  {
    id: 'education',
    icon: PiGraduationCap,
    title: 'Education',
    subtitle: 'Bright Futures Program',
    description: 'We believe every child deserves access to quality education. Our education program provides schooling, tutoring, and educational resources to help children reach their full potential.',
    features: ['Primary & Secondary School Support', 'Tutoring & Homework Help', 'Scholarship Programs', 'Vocational Training'],
    impact: { beneficiaries: '2,500+', schools: '15', teachers: '50+' },
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'healthcare',
    icon: PiHeart,
    title: 'Healthcare',
    subtitle: 'Healthy Hearts Initiative',
    description: 'Comprehensive healthcare services ensure children receive proper medical care, vaccinations, and health education to thrive physically and mentally.',
    features: ['Regular Health Check-ups', 'Vaccination Programs', 'Mental Health Support', 'Health Education'],
    impact: { beneficiaries: '3,000+', clinics: '5', staff: '25+' },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'nutrition',
    icon: PiGear,
    title: 'Nutrition',
    subtitle: 'Nourish Hope Program',
    description: 'Proper nutrition is essential for child development. We provide nutritious meals and nutrition education to ensure healthy growth.',
    features: ['Daily Nutritious Meals', 'Nutrition Education', 'Supplement Programs', 'Community Gardens'],
    impact: { meals: '500,000+', gardens: '10', volunteers: '100+' },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'shelter',
    icon: PiHouse,
    title: 'Shelter',
    subtitle: 'Safe Haven Project',
    description: 'Safe, nurturing environments where children can live, grow, and feel secure. Our shelters provide more than just a roof—they provide a home.',
    features: ['Safe Living Spaces', 'Family-like Environment', 'Recreational Facilities', 'Life Skills Training'],
    impact: { children: '500+', facilities: '8', caregivers: '40+' },
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'aftercare',
    icon: PiLightning,
    title: 'Aftercare',
    subtitle: 'Future Ready Program',
    description: 'Supporting children as they transition to independence with job training, mentorship, and ongoing support systems.',
    features: ['Career Counseling', 'Job Placement Assistance', 'Mentorship Programs', 'Alumni Network'],
    impact: { graduates: '1,200+', placements: '85%', mentors: '200+' },
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'community',
    icon: PiUsers,
    title: 'Community',
    subtitle: 'Community Empowerment',
    description: 'Strengthening communities through awareness programs, parent training, and local partnerships to create sustainable change.',
    features: ['Parent Workshops', 'Community Outreach', 'Local Partnerships', 'Awareness Campaigns'],
    impact: { families: '5,000+', events: '100+', partners: '30+' },
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
  },
]

export default function ProgramsPage() {
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
            <span className="kicker mb-6">Our Programs</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-dark">
              Comprehensive Support
            </h1>
            <p className="mt-6 text-lg text-dark/60 max-w-xl leading-relaxed">
              We offer holistic programs designed to address every aspect of a child&apos;s
              development and well-being.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="space-y-12 lg:space-y-20">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                id={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                      <program.icon className="w-7 h-7 text-lime" />
                    </div>
                    <div>
                      <span className="text-dark/50 text-sm font-medium">{program.subtitle}</span>
                      <h2 className="text-3xl md:text-4xl font-serif text-dark">{program.title}</h2>
                    </div>
                  </div>
                  <p className="mt-6 text-dark/60 leading-relaxed">{program.description}</p>
                  
                  <div className="mt-8">
                    <h4 className="font-semibold text-dark mb-4">Key Activities:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {program.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-dark/60 text-sm">
                          <span className="w-2 h-2 bg-lime rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-6">
                    {Object.entries(program.impact).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-2xl font-serif text-dark font-semibold">{value}</p>
                        <p className="text-dark/50 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] h-full">
                    <Image
                      src={program.image}
                      alt={`${program.title} program at Rescue Mission Orphanage`}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="bg-dark rounded-[2.5rem] px-8 md:px-16 py-16 md:py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral/10 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-4xl font-serif text-cream">Want to Support Our Programs?</h2>
            <p className="mt-3 text-cream/50 max-w-lg mx-auto">Your donation directly impacts the lives of children in need.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/donate" className="btn-lime">
                Donate Now
                <PiArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/get-involved" className="btn-secondary !border-white/30 !text-white hover:!bg-white hover:!text-dark">
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
