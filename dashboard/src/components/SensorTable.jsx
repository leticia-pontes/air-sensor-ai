import { useState } from 'react'
import SensorTableFilters from './SensorTableFilters'

const DEFAULT_FILTERS = { id: '', deviceId: '', moistureMin: '', moistureMax: '', dateFrom: '', dateTo: '' }

export default function SensorTable({ readings }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // atribui número de linha em ordem crescente
  const withRowNum = [...readings].map((r, i) => ({ ...r, _rowNum: i + 1 }))

  const filtered = withRowNum.filter((r) => {
      if (filters.id !== '' && !String(r._rowNum).includes(filters.id)) return false
      if (filters.deviceId && r.DeviceId !== filters.deviceId) return false
      if (filters.moistureMin !== '' && r.Humidity < parseFloat(filters.moistureMin)) return false
      if (filters.moistureMax !== '' && r.Humidity > parseFloat(filters.moistureMax)) return false
      if (filters.dateFrom && r.Timestamp * 1000 < new Date(filters.dateFrom).getTime()) return false
      if (filters.dateTo && r.Timestamp * 1000 > new Date(filters.dateTo).getTime()) return false
      return true
    })

  return (
    <div className="table-wrapper">
      <SensorTableFilters readings={readings} filters={filters} onChange={setFilters} />
      <p className="table-count">{filtered.length} de {readings.length} leituras</p>
      <table className="sensor-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Dispositivo</th>
            <th>Data/Hora</th>
            <th>Temperatura (°C)</th>
            <th>Umidade (%)</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={r._id ?? i}>
              <td>{r._rowNum}</td>
              <td><code>{r.DeviceId}</code></td>
              <td>{new Date(r.Timestamp * 1000).toLocaleString('pt-BR')}</td>
              <td>{r.Temperature?.toFixed(1)} °C</td>
              <td>
                <div className="moisture-bar-container">
                  <div
                    className="moisture-bar"
                    style={{ width: `${Math.min(r.Humidity, 100)}%` }}
                  />
                  <span>{r.Humidity?.toFixed(1)}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
