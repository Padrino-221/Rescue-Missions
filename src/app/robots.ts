import type { MetadataRoute } from 'next'
import { getSettings } from '@/lib/settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings()
  const siteUrl = settings?.siteUrl || 'https://rescuemissionsgh.org'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/mission-control/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
