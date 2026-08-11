import pg from 'pg'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const { Client } = pg

const c = new Client({
  host: 'ep-crimson-thunder-ayvdckx1-pooler.c-5.us-east-2.aws.neon.tech',
  port: 5432,
  user: 'neondb_owner',
  password: 'npg_mZb2xDNrC1kE',
  database: 'neondb',
  ssl: { rejectUnauthorized: false }
})

async function main() {
  await c.connect()

  const settingsPath = join(process.cwd(), 'data', 'settings.json')
  if (existsSync(settingsPath)) {
    const raw = readFileSync(settingsPath, 'utf-8')
    const settings = JSON.parse(raw)
    const json = JSON.stringify(settings)
    await c.query(
      `INSERT INTO settings (id, org_name, tagline, description, founded_year, phone1, phone2, email1, email2, address, office_hours, facebook, twitter, instagram, youtube, children_served, countries_active, volunteers_active, funds_raised, donation_presets, data)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
       ON CONFLICT (id) DO UPDATE SET data = $20`,
      [
        settings.general?.orgName || '',
        settings.general?.tagline || '',
        settings.general?.description || '',
        settings.general?.foundedYear || '',
        settings.contact?.phone1 || '',
        settings.contact?.phone2 || '',
        settings.contact?.email1 || '',
        settings.contact?.email2 || '',
        settings.contact?.address1 || '',
        settings.contact?.officeHours1 || '',
        settings.social?.facebook || '',
        settings.social?.twitter || '',
        settings.social?.instagram || '',
        settings.social?.youtube || '',
        '5,000+',
        '5',
        '186',
        'GH₵2.5M',
        JSON.stringify(settings.donations?.presetAmounts?.map((a) => a.amount) || [25, 50, 100, 250, 500, 1000]),
        json,
      ]
    )
    console.log('Settings seeded into database from settings.json')
  } else {
    console.log('No settings.json found, skipping seed')
  }

  const result = await c.query('SELECT id, data IS NOT NULL as has_data FROM settings WHERE id = 1')
  console.log('Settings row:', result.rows[0])

  await c.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
