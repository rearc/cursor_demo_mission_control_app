import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isLightMode, setIsLightMode] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLightMode)
  }, [isLightMode])

  return (
    <button
      type="button"
      onClick={() => setIsLightMode(prev => !prev)}
      className="inline-flex h-10 w-10 items-center justify-center border border-border-subtle bg-surface-raised text-text-primary transition-colors duration-200 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-card-space/40"
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span className="text-lg leading-none" aria-hidden="true">
        {isLightMode ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
