// src/components/dashboard/RiskTrendCard.jsx
import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
  { value: 'yearly', label: 'Tahunan' },
]

const CHART_MAX = 45

export default function RiskTrendCard({ data }) {
  const [period, setPeriod] = useState('daily')

  const activeData = useMemo(() => data?.[period] ?? [], [data, period])

  return (
    <section className="dashboard-panel risk-trend-card">
      <div className="risk-trend-header">
        <div className="risk-trend-summary">
          <h2>RISK TREND</h2>

          <div className="risk-trend-score-row">
            <strong>0</strong>
            <span className="risk-trend-delta">↓0%</span>
          </div>

          <p>Today</p>
        </div>

        <div className="risk-trend-filter-wrap">
          <select
            className="risk-trend-filter"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Pilih periode risk trend"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown size={18} className="risk-trend-filter-icon" />
        </div>
      </div>

      <div className="risk-trend-chart">
        <div className="risk-trend-grid" aria-hidden="true">
          {[45, 40, 35, 30, 25, 20, 15, 10, 5].map((tick) => (
            <div key={tick} className="risk-trend-grid-line">
              <span>{tick}</span>
            </div>
          ))}
        </div>

        <div className="risk-trend-bars">
          {activeData.map((item) => {
            const barHeight =
              (Math.max(0, Math.min(item.value, CHART_MAX)) / CHART_MAX) * 100

            return (
              <div key={item.label} className="risk-trend-bar-item">
                <div className="risk-trend-bar-area">
                  <div
                    className="risk-trend-value"
                    style={{ bottom: `calc(${barHeight}% + 8px)` }}
                  >
                    {item.value}
                  </div>

                  <div
                    className={`risk-trend-bar ${item.tone}`}
                    style={{ height: `${barHeight}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="risk-trend-label-row">
          {activeData.map((item) => (
            <div key={item.label} className="risk-trend-label">
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <p className="risk-trend-note">Highest Risk on Thursday</p>
    </section>
  )
}