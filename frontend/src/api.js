const API_BASE = '/api'

export async function fetchCards() {
  const res = await fetch(`${API_BASE}/cards`)
  if (!res.ok) throw new Error('Failed to fetch cards')
  return res.json()
}

export async function updateCard(id, fields) {
  const res = await fetch(`${API_BASE}/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  if (!res.ok) throw new Error('Failed to update card')
  return res.json()
}

export async function fetchCardData(source, config = {}) {
  const params = new URLSearchParams(config)
  const query = params.toString()
  const url = `${API_BASE}/data/${source}${query ? `?${query}` : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch data for ${source}`)
  return res.json()
}
