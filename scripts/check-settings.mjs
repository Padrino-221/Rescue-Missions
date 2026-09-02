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
  const res = await c.query('SELECT data FROM site_settings WHERE key = $1', ['main'])
  const data = res.rows[0].data

  console.log('=== exploreOurWork ===')
  console.log(JSON.stringify(data.exploreOurWork, null, 2))

  console.log('\n=== cta ===')
  console.log(JSON.stringify(data.cta, null, 2))

  await c.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
