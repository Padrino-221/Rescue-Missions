/**
 * Migrate social fields from flat object to dynamic array.
 *
 * Old structure: { facebook: 'url', twitter: 'url', ... }
 * New structure: { items: [{ name: 'Facebook', url: 'url' }, ...] }
 *
 * Safe to re-run — it never overwrites existing values.
 *
 * Usage:  node scripts/migrate-social.mjs
 */
import { createClient } from './db.mjs'

const c = createClient()

async function main() {
  await c.connect()
  console.log('Connected to database')

  const res = await c.query('SELECT data FROM site_settings WHERE key = $1', ['main'])
  if (res.rows.length === 0) {
    console.log('No settings found. Run migrate-settings.mjs first.')
    await c.end()
    return
  }

  const data = res.rows[0].data

  // Check if social is already the new structure
  if (data.social?.items && Array.isArray(data.social.items)) {
    console.log('Social is already in the new array structure. Skipping.')
    await c.end()
    return
  }

  // Convert old flat structure to new array
  const oldSocial = data.social || {}
  const platformMap = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
  }

  const items = []
  for (const [key, label] of Object.entries(platformMap)) {
    if (oldSocial[key] && oldSocial[key].trim()) {
      items.push({ name: label, url: oldSocial[key] })
    }
  }

  // Also preserve any extra fields the client may have added
  for (const [key, value] of Object.entries(oldSocial)) {
    if (!platformMap[key] && value && typeof value === 'string' && value.trim()) {
      items.push({ name: key, url: value })
    }
  }

  data.social = { items }

  await c.query(
    'UPDATE site_settings SET data = $1 WHERE key = $2',
    [JSON.stringify(data), 'main']
  )

  console.log(`Migrated social: ${items.length} platforms`, items.map(i => i.name).join(', '))
  console.log('Done!')

  await c.end()
}

main().catch(e => { console.error('Migration failed:', e.message); process.exit(1) })
