'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface WeeklyData {
  day: string
  selesai: number
  telat: number
}

interface WeeklyBarChartProps {
  data: WeeklyData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1a15', border: '1px solid #2e2e28', borderRadius: '6px',
      padding: '8px 12px', fontSize: '11px', fontFamily: 'DM Mono, monospace',
    }}>
      <p style={{ color: '#a09a8e', marginBottom: '4px' }}>{label}</p>
      <p style={{ color: '#c9a84c' }}>Selesai: {payload[0]?.value}</p>
      <p style={{ color: '#c9504c' }}>Telat: {payload[1]?.value}</p>
    </div>
  )
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const [range, setRange] = useState<'7H' | '30H' | '3B'>('30H')

  return (
    <div className="nx-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <p className="font-display" style={{ fontSize: '15px', fontWeight: 600, color: '#e8e6df' }}>
            Performa Task Mingguan
          </p>
          <p className="font-code" style={{ fontSize: '10px', color: '#5a5650', letterSpacing: '0.06em', marginTop: '2px' }}>
            Selesai vs Telat — {range}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['7H', '30H', '3B'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="font-code"
              style={{
                padding: '3px 9px', borderRadius: '4px', fontSize: '10px',
                fontFamily: 'DM Mono, monospace', cursor: 'pointer',
                background: range === r ? 'rgba(201,168,76,0.08)' : '#1a1a15',
                border: `1px solid ${range === r ? 'rgba(201,168,76,0.4)' : '#222220'}`,
                color: range === r ? '#c9a84c' : '#5a5650',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fontFamily: 'DM Mono, monospace', fill: '#5a5650' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="selesai" radius={[2, 2, 0, 0]} fill="#c9a84c" />
          <Bar dataKey="telat" radius={[2, 2, 0, 0]} fill="rgba(201,80,76,0.5)" />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
        {[
          { color: '#c9a84c', label: 'Selesai' },
          { color: '#c9504c', label: 'Telat', opacity: 0.7 },
        ].map((leg) => (
          <div key={leg.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '2px', background: leg.color, borderRadius: '1px', opacity: leg.opacity ?? 1 }} />
            <span className="font-code" style={{ fontSize: '9.5px', color: '#5a5650' }}>{leg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
