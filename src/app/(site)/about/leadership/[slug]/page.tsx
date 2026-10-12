import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi'
import { getSettings } from '@/lib/settings'
import { findTeamMember, resolveTeam, teamSlug } from '@/lib/team'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const settings = await getSettings()
  const team = resolveTeam(settings?.about?.team)
  const found = findTeamMember(team, slug)
  const orgName = settings?.general?.orgName || 'Rescue Mission Orphanage'
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  if (!found) return { title: `Leadership | ${orgName}` }

  return {
    title: `${found.member.name} | Leadership | ${orgName}`,
    description: `${found.member.name} — ${found.member.role}. ${found.member.bio}`.slice(0, 160),
    openGraph: {
      title: `${found.member.name} | ${orgName}`,
      description: `${found.member.role} at ${orgName}.`,
      url: `${siteUrl}/about/leadership/${teamSlug(found.member.name, found.index)}`,
    },
  }
}

export default async function LeadershipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const settings = await getSettings()
  const team = resolveTeam(settings?.about?.team)
  const found = findTeamMember(team, slug)

  if (!found) notFound()

  const { member, index } = found
  const others = team.filter((_, i) => i !== index).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="bg-cream pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden relative">
        <div className="absolute top-24 right-0 w-72 h-72 bg-lime/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container-premium">
          <div className="max-w-3xl">
            <Link
              href="/about#team"
              className="inline-flex items-center gap-2 text-dark/60 hover:text-dark transition-colors text-sm font-medium"
            >
              <PiArrowLeft className="w-4 h-4" />
              Back to Leadership
            </Link>
            <div className="mt-6">
              <span className="pill-tag inline-block">Leadership</span>
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-serif text-dark">
              {member.name}
            </h1>
            <p className="mt-3 text-lg text-lime font-medium">{member.role}</p>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="section-padding bg-cream">
        <div className="container-premium">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute -inset-3 bg-lime/20 rounded-[2.5rem] rotate-1" />
                <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] bg-dark/5 border-2 border-white">
                  {member.avatar && (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 35vw, 100vw"
                      className="object-cover object-top"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="text-2xl md:text-3xl font-serif text-dark">About {member.name.split(' ')[0]}</h2>
              <div className="mt-5 space-y-4 text-dark/65 text-[15px] leading-relaxed whitespace-pre-wrap">
                {member.bio || 'Leadership team member at Rescue Mission Orphanage.'}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-lime">
                  Contact Us
                  <PiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about#team"
                  className="btn-secondary"
                >
                  <PiArrowLeft className="w-4 h-4" />
                  All Leaders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other leaders */}
      {others.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-premium">
            <h2 className="text-2xl md:text-3xl font-serif text-dark text-center">
              Meet Other Leaders
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((other) => {
                const otherIndex = team.findIndex((m) => m === other)
                return (
                  <Link
                    key={other.name || `other-${otherIndex}`}
                    href={`/about/leadership/${teamSlug(other.name, otherIndex)}`}
                    className="card-premium overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden bg-dark/5">
                      {other.avatar && (
                        <Image
                          src={other.avatar}
                          alt={other.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-dark group-hover:text-dark-100 transition-colors">
                        {other.name}
                      </h3>
                      <p className="text-lime text-sm font-medium">{other.role}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
