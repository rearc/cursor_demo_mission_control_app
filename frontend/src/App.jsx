import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Dashboard
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Personal command center</p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Dashboard />
      </main>
    </div>
  )
}
