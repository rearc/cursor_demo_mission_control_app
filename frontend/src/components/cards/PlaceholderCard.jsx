export default function PlaceholderCard() {
  return (
    <div className="border border-dashed border-border-subtle rounded-sm p-8 text-center">
      <p className="text-2xl mb-3 opacity-60">✨</p>
      <p className="text-text-secondary text-sm font-medium">
        What should we build here?
      </p>
      <p className="text-text-muted text-xs mt-1">This slot is waiting for a new widget</p>
    </div>
  )
}
