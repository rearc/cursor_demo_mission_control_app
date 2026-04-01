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

async function readErrorMessage(res) {
  try {
    const body = await res.json()
    return body.error || res.statusText
  } catch {
    return res.statusText
  }
}

export async function fetchTodos(cardId) {
  const res = await fetch(`${API_BASE}/todos?card_id=${cardId}`)
  if (!res.ok) throw new Error(await readErrorMessage(res))
  return res.json()
}

export async function createTodo(cardId, text) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id: cardId, text }),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res))
  return res.json()
}

export async function updateTodo(todoId, fields) {
  const res = await fetch(`${API_BASE}/todos/${todoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res))
  return res.json()
}

export async function deleteTodo(todoId) {
  const res = await fetch(`${API_BASE}/todos/${todoId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await readErrorMessage(res))
}
