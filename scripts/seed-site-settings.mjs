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
      `INSERT INTO site_settings (key, data) VALUES ('main', $1)
       ON CONFLICT (key) DO UPDATE SET data = $1`,
      [json]
    )
    console.log('Settings seeded into site_settings table')
  }

  const result = await c.query('SELECT key, pg_column_size(data) as size FROM site_settings WHERE key = $1', ['main'])
  console.log('Row:', result.rows[0])

  await c.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
