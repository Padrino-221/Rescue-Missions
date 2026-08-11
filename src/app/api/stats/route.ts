import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireAuth } from '@/lib/api-auth'

export async function GET() {
  const unauthorized = await requireAuth()
  if (unauthorized) return unauthorized

  const [stats] = await query(
    `SELECT
       (SELECT count(*)::int FROM contacts WHERE NOT read) AS unread_contacts,
       (SELECT count(*)::int FROM contacts) AS total_contacts,
       (SELECT count(*)::int FROM stories WHERE featured) AS published_stories,
       (SELECT count(*)::int FROM stories) AS total_stories,
       (SELECT count(*)::int FROM programs WHERE status = 'active') AS active_programs,
       (SELECT count(*)::int FROM programs) AS total_programs,
       (SELECT count(*)::int FROM gallery_items) AS gallery_items`
  )

  const [stories, contacts, gallery] = await Promise.all([
    query(
      `SELECT id, title AS name, date FROM stories ORDER BY id DESC LIMIT 3`
    ),
    query(
      `SELECT id, name, date FROM contacts ORDER BY id DESC LIMIT 2`
    ),
    query(
      `SELECT id, title AS name FROM gallery_items ORDER BY id DESC LIMIT 2`
    ),
  ])

  const activity = [
    ...stories.map((s) => ({
      id: `s${s.id}`,
      type: 'story',
      message: `Story "${s.name}" was added`,
    })),
    ...contacts.map((c) => ({
      id: `c${c.id}`,
      type: 'contact',
      message: `New contact inquiry from ${c.name}`,
    })),
    ...gallery.map((g) => ({
      id: `g${g.id}`,
      type: 'gallery',
      message: `"${g.name}" was added to the gallery`,
    })),
  ].slice(0, 6)

  return NextResponse.json({
    stats: {
      unreadContacts: stats.unread_contacts,
      totalContacts: stats.total_contacts,
      publishedStories: stats.published_stories,
      totalStories: stats.total_stories,
      activePrograms: stats.active_programs,
      totalPrograms: stats.total_programs,
      galleryItems: stats.gallery_items,
    },
    activity,
  })
}
