const API_BASE = '/api'

export async function fetchReadings() {
  const res = await fetch(`${API_BASE}/DHT`)
  if (!res.ok) throw new Error(`Erro ao buscar leituras: ${res.status}`)
  const data = await res.json()

  // Firebase returns an object keyed by push-id; convert to array
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return Object.entries(data).map(([id, value]) => ({ _id: id, ...value }))
  }
  if (Array.isArray(data)) return data
  return []
}

export async function postReading(reading) {
  const res = await fetch(`${API_BASE}/DHT`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading),
  })
  if (!res.ok) throw new Error(`Erro ao enviar leitura: ${res.status}`)
  return res.json()
}
