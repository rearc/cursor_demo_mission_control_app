import { useState, useEffect } from 'react'
import { fetchCardData } from '../api'
import WeatherCard from './cards/WeatherCard'
import QuoteCard from './cards/QuoteCard'
import SpaceCard from './cards/SpaceCard'
import PlaceholderCard from './cards/PlaceholderCard'

const CARD_REGISTRY = {
  weather:     { component: WeatherCard,     accent: 'card-weather',     needsData: true },
  quote:       { component: QuoteCard,       accent: 'card-quote',       needsData: true },
  space:       { component: SpaceCard,       accent: 'card-space',       needsData: true },
  placeholder: { component: PlaceholderCard, accent: 'card-placeholder', needsData: false },
}

export default function Card({ card, locked }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const entry = CARD_REGISTRY[card.source] || CARD_REGISTRY.placeholder
  const configKey = JSON.stringify(card.config || {})

  useEffect(() => {
    if (!entry.needsData) {
      setLoading(false)
      return
    }
    fetchCardData(card.source, card.config || {})
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [card.source, entry.needsData, configKey])

  const CardContent = entry.component
  const accentColor = `var(--color-${entry.accent})`

  return (
    <div
      className={`group relative h-full bg-surface-raised border border-border-subtle overflow-hidden transition-all duration-300 hover:bg-surface-hover hover:border-transparent hover:shadow-lg ${!locked ? 'ring-1 ring-card-placeholder/20' : ''}`}
      style={{ '--glow': accentColor }}
    >
      {/* Accent glow on left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300 group-hover:w-1"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${accentColor}15, transparent)` }}
      />

      <div className="p-5 pl-4 h-full flex flex-col">
        <div className={`flex items-center gap-3 mb-3 ${!locked ? 'card-drag-handle cursor-grab active:cursor-grabbing' : ''}`}>
          <span className="text-xl">{card.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-semibold text-text-primary leading-tight">
              {card.title}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">{card.description}</p>
          </div>
          {!locked && (
            <span className="text-text-muted text-xs select-none" title="Drag to move">
              ⠿
            </span>
          )}
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-text-muted animate-subtle-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <p className="text-sm text-red-400/80 py-4">{error}</p>
          ) : (
            <CardContent data={data} card={card} />
          )}
        </div>
      </div>
    </div>
  )
}
