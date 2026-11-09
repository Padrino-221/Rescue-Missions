import { youtubeId } from '@/lib/youtube'

export default function YouTubeEmbed({
  url,
  title,
  align = 'center',
}: {
  url?: string
  title: string
  align?: 'center' | 'left'
}) {
  const id = youtubeId(url)
  if (!id) return null

  return (
    <div className={`relative mt-8 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl bg-dark ${align === 'center' ? 'mx-auto' : 'mx-auto lg:mx-0'}`}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
