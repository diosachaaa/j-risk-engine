import { useMemo } from 'react'

import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

const CHART_HEIGHT = 280
const CHART_WIDTH = 520
const Y_MAX = 60
const Y_MIN = 0
const Y_TICKS = [60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5]

function getPointY(value) {
  const bounded = Math.max(Y_MIN, Math.min(Y_MAX, value))
  const ratio = (bounded - Y_MIN) / (Y_MAX - Y_MIN)
  return CHART_HEIGHT - ratio * CHART_HEIGHT
}

export default function ManagementTrendCard({ data = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const safeData = Array.isArray(data) ? data : []

  const points = useMemo(() => {
    if (safeData.length === 0) return []

    const step =
      safeData.length > 1 ? CHART_WIDTH / (safeData.length - 1) : CHART_WIDTH

    return safeData.map((item, index) => ({
      ...item,
      x: index * step,
      y: getPointY(item.value),
    }))
  }, [safeData])

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <section className="dashboard-panel dashboard-card management-chart-card management-line-card">
      <div className="dashboard-card-header management-card-header-centered">
        <h2>{t.managementPage.trendTitle}</h2>
      </div>

      <div className="management-line-chart">
        <div className="management-line-grid" aria-hidden="true">
          {Y_TICKS.map((tick) => (
            <div key={tick} className="management-line-grid-row">
              <span>{tick}</span>
            </div>
          ))}
        </div>

        <svg
          className="management-line-svg"
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          aria-label={t.managementPage.trendAriaLabel}
          role="img"
        >
          {points.length > 0 && (
            <polyline className="management-line-path" points={polylinePoints} />
          )}

          {points.map((point) => (
            <circle
              key={`${point.label}-${point.x}`}
              className="management-line-dot"
              cx={point.x}
              cy={point.y}
              r="4"
            />
          ))}
        </svg>

        <div className="management-line-labels" aria-hidden="true">
          {safeData.map((item, index) => (
            <span key={`${item.label}-${index}`}>{item.label}</span>
          ))}
        </div>
      </div>
    </section>
  )
}