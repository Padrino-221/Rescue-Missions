'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SiteSettings } from '@/lib/settings'

/**
 * Loads site settings from the settings API once on mount.
 *
 * Returns the settings object (null until loaded / on failure) plus a reload()
 * to refetch. Every settings-driven component on the public site uses this so
 * the fetch-on-mount behavior stays consistent.
 */
export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  const reload = useCallback(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load settings (${res.status})`)
        return res.json()
      })
      .then((data: unknown) => setSettings(data as SiteSettings))
      .catch(() => setSettings(null))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { settings, reload }
}