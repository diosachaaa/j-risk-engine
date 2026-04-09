import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

const FALLBACK_MAX = 45

function buildTrendSummary(activeData = []) {
  if (!Array.isArray(activeData) || activeData.length === 0) {
    return {
      currentValue: 0,
      deltaText: '0%',
      deltaClassName: 'neutral',
      highestRiskLabel: '-',
      chartMax: FALLBACK_MAX,
    }
  }

  const currentValue = Number(activeData[activeData.length - 1]?.value ?? 0)
  const firstValue = Number(activeData[0]?.value ?? 0)
  const maxValue = Math.max(...activeData.map((item) => Number(item?.value ?? 0)), 0)

  const deltaValue =
    firstValue === 0 ? 0 : Math.round(((currentValue - firstValue) / firstValue) * 100)

  const deltaText =
    deltaValue > 0 ? `↑${Math.abs(deltaValue)}%` : deltaValue < 0 ? `↓${Math.abs(deltaValue)}%` : '0%'

  const deltaClassName =
    deltaValue > 0 ? 'up' : deltaValue < 0 ? 'down' : 'neutral'

  const highestRiskItem = activeData.reduce((highest, item) => {
    if (!highest) return item
    return Number(item?.value ?? 0) > Number(highest?.value ?? 0) ? item : highest
  }, null)

  const roundedChartMax = Math.max(
    FALLBACK_MAX,
    Math.ceil(maxValue / 5) * 5,
  )

  return {
    currentValue,
    deltaText,
    deltaClassName,
    highestRiskLabel: highestRiskItem?.label ?? '-',
    chartMax: roundedChartMax,
  }
}

function buildTicks(maxValue) {
  const safeMax = Math.max(5, maxValue)
  const step = Math.max(5, Math.round(safeMax / 9 / 5) * 5 || 5)
  const ticks = []

  for (let tick = safeMax; tick >= step; tick -= step) {
    ticks.push(tick)
  }

  return ticks
}

export default function RiskTrendCard({ data = {} }) {
  const [period, setPeriod] = useState('daily')

  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const periodOptions = [
    { value: 'daily', label: t.riskTrend.periods.daily },
    { value: 'weekly', label: t.riskTrend.periods.weekly },
    { value: 'monthly', label: t.riskTrend.periods.monthly },
    { value: 'yearly', label: t.riskTrend.periods.yearly },
  ]

  const activeData = useMemo(() => data?.[period] ?? [], [data, period])

  const { currentValue, deltaText, deltaClassName, highestRiskLabel, chartMax } =
    useMemo(() => buildTrendSummary(activeData), [activeData])

  const ticks = useMemo(() => buildTicks(chartMax), [chartMax])

  const emptyText =
    language === 'en'
      ? 'Risk trend data is not available yet.'
      : 'Data tren risiko belum tersedia.'

  const noteText =
    highestRiskLabel === '-'
      ? emptyText
      : `${t.riskTrend.highestRiskPrefix} ${highestRiskLabel}`

  return (
    <section className="dashboard-panel risk-trend-card">
      <div className="risk-trend-header">
        <div className="risk-trend-summary">
          <h2>{t.riskTrend.title}</h2>

          <div className="risk-trend-score-row">
            <strong>{currentValue}</strong>
            <span className={`risk-trend-delta ${deltaClassName}`}>{deltaText}</span>
          </div>

          <p>{t.riskTrend.today}</p>
        </div>

        <div className="risk-trend-filter-wrap">
          <select
            className="risk-trend-filter"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label={t.riskTrend.selectPeriod}
          >
            {periodOptions.map((option) => (
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
          {ticks.map((tick) => (
            <div key={tick} className="risk-trend-grid-line">
              <span>{tick}</span>
            </div>
          ))}
        </div>

        <div className="risk-trend-bars">
          {activeData.length > 0 ? (
            activeData.map((item, index) => {
              const rawValue = Number(item?.value ?? 0)
              const barHeight = chartMax > 0 ? (Math.max(0, Math.min(rawValue, chartMax)) / chartMax) * 100 : 0

              return (
                <div
                  key={item.label ?? `trend-${index}`}
                  className="risk-trend-bar-item"
                >
                  <div className="risk-trend-bar-area">
                    <div
                      className="risk-trend-value"
                      style={{ bottom: `calc(${barHeight}% + 8px)` }}
                    >
                      {rawValue}
                    </div>

                    <div
                      className={`risk-trend-bar ${item.tone ?? 'yellow'}`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="risk-trend-empty">{emptyText}</div>
          )}
        </div>

        {activeData.length > 0 ? (
          <div className="risk-trend-label-row">
            {activeData.map((item, index) => (
              <div key={item.label ?? `label-${index}`} className="risk-trend-label">
                {item.label ?? '-'}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <p className="risk-trend-note">{noteText}</p>
    </section>
  )
}