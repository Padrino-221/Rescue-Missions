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
  await c.query('ALTER TABLE settings ADD COLUMN IF NOT EXISTS data JSONB')
  console.log('Added data JSONB column to settings table')

  const cols = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'settings'")
  console.log('Columns:', cols.rows.map(r => r.column_name).join(', '))

  await c.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
