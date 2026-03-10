import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Leaf, BarChart2, X } from 'lucide-react'
import { fetchReadings } from './api'
import SensorChart from './components/SensorChart'
import SensorTable from './components/SensorTable'
import StatusBadge from './components/StatusBadge'
import './App.css'

const REFRESH_INTERVAL = 10000

const USE_MOCK = false // altere para false quando a API estiver disponível

const MOCK_READINGS = Array.from({ length: 20 }, (_, i) => ({
  Timestamp: Math.floor(Date.now() / 1000) - (19 - i) * 60,
  Temperature: 20 + Math.sin(i * 0.5) * 8 + Math.random() * 2,
  Humidity: 50 + Math.sin(i * 0.5) * 25 + Math.random() * 5,
  DeviceId: 'ESP32-MOCK-01',
}))

export default function App() {
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  // btnState: 'idle' | 'spinning' | 'done'
  const [btnState, setBtnState] = useState('idle')

  const loadData = useCallback(async () => {
    if (USE_MOCK) {
      setReadings(MOCK_READINGS)
      setError(null)
      setLastUpdated(new Date())
      setLoading(false)
      return
    }
    try {
      const data = await fetchReadings()
      data.sort((a, b) => a.Timestamp - b.Timestamp)
      setReadings(data)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [loadData])

  const latest = readings[readings.length - 1]

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="header-icon"><Leaf color="SeaGreen" fill="LimeGreen" size={48}/></span>
          <div>
            <h1>AirSensor AI</h1>
            <p className="header-subtitle">Monitoramento de Umidade do Solo</p>
          </div>
        </div>
        <div className="header-right">
          <StatusBadge error={error} loading={loading} lastUpdated={lastUpdated} />
          <button
            className="btn-refresh"
            onClick={() => {
              if (!loading) {
                setBtnState('spinning')
                setTimeout(() => {
                  setBtnState('done')
                  setTimeout(() => setBtnState('idle'), 400)
                }, 600)
              }
              loadData()
            }}
            disabled={loading}
          >
            {loading || btnState === 'spinning' ? (
              <RefreshCw
                size={15}
                style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, animation: loading ? 'spin 1s linear infinite' : 'spin 0.6s linear 1' }}
              />
            ) : btnState === 'done' ? (
              <X size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            ) : (
              <RefreshCw size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            )}
            Atualizar
          </button>
        </div>
      </header>

      {error && (
        <div className="alert-error">
          ⚠️ {error} — verifique se o AirSensorAI está rodando em{' '}
          <code>https://air-sensor-ai--leticia-hub.replit.app</code>
        </div>
      )}

      {latest && (
        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Última Leitura</span>
            <span className="kpi-value">{new Date(latest.Timestamp * 1000).toLocaleString('pt-BR')}</span>
          </div>
          <div className="kpi-card accent-green">
            <span className="kpi-label">Temperatura</span>
            <span className="kpi-value">{latest.Temperature?.toFixed(1)} °C</span>
          </div>
          <div className="kpi-card accent-blue">
            <span className="kpi-label">Umidade (%)</span>
            <span className="kpi-value">{latest.Humidity?.toFixed(1)}%</span>
          </div>
          <div className="kpi-card accent-purple">
            <span className="kpi-label">Dispositivo</span>
            <span className="kpi-value device-id">{latest.DeviceId}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Total de Leituras</span>
            <span className="kpi-value">{readings.length}</span>
          </div>
        </section>
      )}

      {readings.length > 0 ? (
        <>
          <section className="section">
            <h2>Umidade ao Longo do Tempo</h2>
            <SensorChart readings={readings} />
          </section>
          <section className="section">
            <h2>Histórico de Leituras</h2>
            <SensorTable readings={readings} />
          </section>
        </>
      ) : (
        !loading && !error && (
          <div className="empty-state">
            <span><BarChart2 size={48}/></span>
            <p>Nenhuma leitura disponível.</p>
          </div>
        )
      )}
    </div>
  )
}
