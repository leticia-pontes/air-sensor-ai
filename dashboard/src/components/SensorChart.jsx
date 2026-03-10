import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function SensorChart({ readings }) {
  const data = readings.map((r) => ({
    time: formatTime(r.Timestamp),
    'Temperatura (°C)': parseFloat(r.Temperature?.toFixed(2)),
    'Umidade (%)': parseFloat(r.Humidity?.toFixed(2)),
  }))

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9090aa' }} interval="preserveStartEnd" />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9090aa' }} unit="°C" />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9090aa' }} unit="%" domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #3a3a5a', borderRadius: 8 }}
            labelStyle={{ color: '#ccc' }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Temperatura (°C)"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="Umidade (%)"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
