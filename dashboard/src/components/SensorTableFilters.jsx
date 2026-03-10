export default function SensorTableFilters({ readings, filters, onChange }) {
  const devices = [...new Set(readings.map((r) => r.DeviceId))].sort()

  return (
    <div className="table-filters">
        <div className="filter-group">
        <label>#</label>
        <input
          type="number"
          min={1}
          max={readings.length}
          placeholder="Todos"
          value={filters.id}
          onChange={(e) => onChange({ ...filters, id: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Dispositivo</label>
        <select
          value={filters.deviceId}
          onChange={(e) => onChange({ ...filters, deviceId: e.target.value })}
        >
          <option value="">Todos</option>
          {devices.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Umidade mín. (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="0"
          value={filters.moistureMin}
          onChange={(e) => onChange({ ...filters, moistureMin: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Umidade máx. (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          placeholder="100"
          value={filters.moistureMax}
          onChange={(e) => onChange({ ...filters, moistureMax: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Data inicial</label>
        <input
          type="datetime-local"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Data final</label>
        <input
          type="datetime-local"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        />
      </div>

      <button
        className="btn-clear-filters"
        onClick={() =>
          onChange({ id:'' ,deviceId: '', moistureMin: '', moistureMax: '', dateFrom: '', dateTo: '' })
        }
      >
        Limpar filtros
      </button>
    </div>
  )
}
