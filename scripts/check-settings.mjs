import { createClient } from './db.mjs'

const c = createClient()

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
