export default function WeatherCard({ data }) {
  if (data?.fallback) {
    return (
      <div className="text-center py-4">
        <p className="text-3xl mb-2">🌤️</p>
        <p className="text-sm text-text-muted">{data.description}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold text-text-primary tracking-tight">
            {Math.round(data.temp)}°
          </p>
          <p className="text-sm text-text-secondary capitalize mt-0.5">{data.description}</p>
        </div>
        {data.icon_emoji && (
          <span className="text-5xl opacity-90">{data.icon_emoji}</span>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-text-muted pt-1">
        <span>{data.city}</span>
        {data.humidity != null && <span>{data.humidity}% humidity</span>}
      </div>
    </div>
  )
}
