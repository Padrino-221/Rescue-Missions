'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useResource<T>(path: string) {
  const router = useRouter()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(() => {
    fetch(path)
      .then((res) => {
        if (res.status === 401) {
          router.replace('/mission-control/login')
          return []
        }
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
  }, [path, router])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, setData, loading, error, reload }
}
