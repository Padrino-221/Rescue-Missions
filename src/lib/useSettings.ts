'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SiteSettings } from '@/lib/settings'

/**
 * Loads site settings from the settings API once on mount.
 *
 * If `initialSettings` is provided (from server-side rendering), it is used
 * immediately so the user never sees hardcoded defaults. Otherwise, settings
 * are fetched from the API on mount.
 */
export function useSettings(initialSettings?: SiteSettings | null) {
  const [settings, setSettings] = useState<SiteSettings | null>(
    initialSettings ?? null
  )
  const [loading, setLoading] = useState(!initialSettings)

  const reload = useCallback(() => {
    setLoading(true)
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load settings (${res.status})`)
        return res.json()
      })
      .then((data: unknown) => setSettings(data as SiteSettings))
      .catch(() => setSettings(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!initialSettings) {
      reload()
    }
  }, [reload, initialSettings])

  return { settings, loading, reload }
}
