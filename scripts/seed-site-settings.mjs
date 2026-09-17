import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { createClient } from './db.mjs'

// By default this script NEVER overwrites settings that already exist in the
// database, so content edited on the deployed site is preserved. Set FORCE=1
// to explicitly overwrite the stored settings.
const force = process.env.FORCE === '1'

const c = createClient()

async function main() {
  await c.connect()

  const settingsPath = join(process.cwd(), 'data', 'settings.json')
  if (existsSync(settingsPath)) {
    const raw = readFileSync(settingsPath, 'utf-8')
    const settings = JSON.parse(raw)
    const json = JSON.stringify(settings)
    await c.query(
      `INSERT INTO site_settings (key, data) VALUES ('main', $1)
       ON CONFLICT (key) ${force ? 'DO UPDATE SET data = $1' : 'DO NOTHING'}`,
      [json]
    )
    console.log(
      force
        ? 'Settings overwritten in site_settings table (FORCE=1)'
        : 'Settings seeded into site_settings table (existing settings left untouched)'
    )
  }

  const result = await c.query('SELECT key, pg_column_size(data) as size FROM site_settings WHERE key = $1', ['main'])
  console.log('Row:', result.rows[0])

  await c.end()
}

main().catch(e => { console.error(e.message); process.exit(1) })
