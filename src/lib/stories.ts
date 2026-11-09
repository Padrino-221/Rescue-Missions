import { query } from './db'

let videoColumnReady: Promise<void> | undefined

export function ensureStoryVideoColumn(): Promise<void> {
  videoColumnReady ??= query("ALTER TABLE stories ADD COLUMN IF NOT EXISTS video_url TEXT NOT NULL DEFAULT ''")
    .then(() => undefined)
    .catch((error) => {
      videoColumnReady = undefined
      throw error
    })
  return videoColumnReady
}
