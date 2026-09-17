import { createClient } from './db.mjs'

const c = createClient()

async function main() {
  await c.connect()

  await c.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      data JSONB NOT NULL DEFAULT '{}'::jsonb
    )
  `)
  console.log('Created site_settings table')

  await c.query(`
    INSERT INTO site_settings (key, data) VALUES ('main', '{}'::jsonb)
    ON CONFLICT (key) DO NOTHING
  `)
  console.log('Ensured main row exists')

  await c.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
