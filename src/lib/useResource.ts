'use client'

import { useCallback, useEffect, useState } from 'react'

export function useResource<T>(path: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(() => {
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`)
        return res.json()
      })
      .then((json: unknown) => {
        const rows = Array.isArray(json) ? json : (json as { data?: T[] }).data ?? []
        setData(rows)
        setError('')
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }, [path])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, setData, loading, error, reload }
}
