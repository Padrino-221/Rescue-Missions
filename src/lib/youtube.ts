export function youtubeId(value: unknown): string | null {
  if (typeof value !== 'string') return null

  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null

    let id: string | null = null
    if (url.hostname === 'youtu.be') {
      id = url.pathname.split('/')[1]
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      const [, type, pathId] = url.pathname.split('/')
      if (type === 'watch') id = url.searchParams.get('v')
      if (['embed', 'shorts', 'live'].includes(type)) id = pathId
    }

    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

export function isOptionalYouTubeUrl(value: unknown): boolean {
  return typeof value === 'string' && (value.trim() === '' || youtubeId(value) !== null)
}
