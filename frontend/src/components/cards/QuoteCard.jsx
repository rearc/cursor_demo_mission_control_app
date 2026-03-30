export default function QuoteCard({ data }) {
  if (!data) return null
  return (
    <div className="py-1">
      <blockquote className="text-[17px] italic text-text-primary/90 leading-relaxed font-light">
        &ldquo;{data.text}&rdquo;
      </blockquote>
      <p className="mt-4 text-xs text-text-muted tracking-wide uppercase">
        {data.author}
        {data.fallback && (
          <span className="ml-2 normal-case tracking-normal opacity-50">(offline)</span>
        )}
      </p>
    </div>
  )
}
