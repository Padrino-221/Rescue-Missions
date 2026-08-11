import pg from 'pg'
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
