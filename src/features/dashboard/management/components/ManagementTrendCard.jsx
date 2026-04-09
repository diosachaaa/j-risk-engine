import { useMemo } from 'react'

import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

const CHART_HEIGHT = 280
const CHART_WIDTH = 520
const FALLBACK_Y_MAX = 60
const Y_MIN = 0

function buildChartMax(data = []) {
  const maxValue = Math.max(...data.map((item) => Number(item?.value ?? 0)), 0)

  if (maxValue <= FALLBACK_Y_MAX) return FALLBACK_Y_MAX

  return Math.ceil(maxValue / 10) * 10
}

function buildYTicks(yMax) {
  const step = Math.max(5, Math.round(yMax / 6 / 5) * 5 || 5)
  const ticks = []

  for (let tick = yMax; tick >= step; tick -= step) {
    ticks.push(tick)
  }

  return ticks
}

function getPointY(value, yMax) {
  const bounded = Math.max(Y_MIN, Math.min(yMax, Number(value ?? 0)))
  const ratio = yMax === Y_MIN ? 0 : (bounded - Y_MIN) / (yMax - Y_MIN)

  return CHART_HEIGHT - ratio * CHART_HEIGHT
}

export default function ManagementTrendCard({ data = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const safeData = Array.isArray(data) ? data : []
  const chartMax = useMemo(() => buildChartMax(safeData), [safeData])
  const yTicks = useMemo(() => buildYTicks(chartMax), [chartMax])

  const points = useMemo(() => {
    if (safeData.length === 0) return []

    const step =
      safeData.length > 1 ? CHART_WIDTH / (safeData.length - 1) : CHART_WIDTH / 2

    return safeData.map((item, index) => ({
      ...item,
      x: safeData.length > 1 ? index * step : CHART_WIDTH / 2,
      y: getPointY(item.value, chartMax),
    }))
  }, [safeData, chartMax])

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ')

  const emptyText =
    language === 'en'
      ? 'Trend data is not available yet.'
      : 'Data tren belum tersedia.'

  return (
    <section className="dashboard-panel dashboard-card management-chart-card management-line-card">
      <div className="dashboard-card-header management-card-header-centered">
        <h2>{t.managementPage.trendTitle}</h2>
      </div>

      <div className="management-line-chart">
        <div className="management-line-grid" aria-hidden="true">
          {yTicks.map((tick) => (
            <div key={tick} className="management-line-grid-row">
              <span>{tick}</span>
            </div>
          ))}
        </div>

        {points.length > 0 ? (
          <>
            <svg
              className="management-line-svg"
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              aria-label={t.managementPage.trendAriaLabel}
              role="img"
            >
              <polyline className="management-line-path" points={polylinePoints} />

              {points.map((point, index) => (
                <circle
                  key={`${point.label ?? 'point'}-${index}`}
                  className="management-line-dot"
                  cx={point.x}
                  cy={point.y}
                  r="4"
                />
              ))}
            </svg>

            <div className="management-line-labels" aria-hidden="true">
              {safeData.map((item, index) => (
                <span key={`${item.label ?? 'label'}-${index}`}>
                  {item.label ?? '-'}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="dashboard-card-empty">{emptyText}</p>
        )}
      </div>
    </section>
  )
}