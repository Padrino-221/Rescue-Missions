'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SiteSettings } from '@/lib/settings'

/**
 * Loads site settings from the settings API once on mount.
 *
 * Returns the settings object (null until loaded / on failure) plus a loading
 * flag and a reload() to refetch. Components should render nothing while
 * loading is true so the user never sees hardcoded defaults before the DB
 * values arrive.
 */
export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

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
    reload()
  }, [reload])

  return { settings, loading, reload }
}
