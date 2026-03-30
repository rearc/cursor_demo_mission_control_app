export default function SpaceCard({ data }) {
  if (data?.fallback) {
    return (
      <div className="text-center py-4">
        <p className="text-3xl mb-2">🔭</p>
        <p className="text-sm text-text-muted">{data.explanation}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.url && data.media_type === 'image' ? (
        <img
          src={data.url}
          alt={data.title}
          className="w-full h-44 object-cover rounded-sm"
        />
      ) : data.url && data.media_type === 'video' ? (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-8 bg-surface rounded-sm text-card-space hover:text-card-space/80 transition-colors"
        >
          <span>▶</span> Watch today&apos;s space video
        </a>
      ) : null}
      <h3 className="text-sm font-semibold text-text-primary">{data.title}</h3>
      <p className="text-xs text-text-secondary leading-relaxed">{data.explanation}</p>
      {data.date && (
        <p className="text-xs text-text-muted">{data.date}</p>
      )}
    </div>
  )
}
