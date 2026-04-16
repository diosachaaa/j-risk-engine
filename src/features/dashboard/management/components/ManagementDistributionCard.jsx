import { useMemo } from 'react'

import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

const toneClassMap = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
}

const fallbackSegments = [
  { level: 'low', value: 0, percentage: 0, color: '#cfe2d0' },
  { level: 'medium', value: 0, percentage: 0, color: '#f1d9aa' },
  { level: 'high', value: 0, percentage: 0, color: '#eda1a5' },
]

function buildGradient(segments) {
  const hasValue = segments.some((segment) => (segment.percentage ?? 0) > 0)

  if (!hasValue) {
    return 'conic-gradient(#f2f2f2 0% 100%)'
  }

  return `conic-gradient(${segments
    .map((segment, index) => {
      const previousTotal = segments
        .slice(0, index)
        .reduce((total, item) => total + (item.percentage ?? 0), 0)

      const nextTotal = previousTotal + (segment.percentage ?? 0)

      return `${segment.color} ${previousTotal}% ${nextTotal}%`
    })
    .join(', ')})`
}

export default function ManagementDistributionCard({ segments = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const safeSegments = Array.isArray(segments) && segments.length > 0
    ? segments.map((segment) => ({
        level: segment.level,
        value: segment.value ?? 0,
        percentage: segment.percentage ?? 0,
        color:
          segment.color ??
          fallbackSegments.find((item) => item.level === segment.level)?.color ??
          '#f2f2f2',
      }))
    : fallbackSegments

  const gradient = useMemo(() => buildGradient(safeSegments), [safeSegments])

  const chartSegments = useMemo(() => {
    const LABEL_RADIUS = 58

    return safeSegments.map((segment, index) => {
      const previousTotal = safeSegments
        .slice(0, index)
        .reduce((total, item) => total + (item.percentage ?? 0), 0)

      const middlePercent = previousTotal + (segment.percentage ?? 0) / 2
      const angle = (middlePercent / 100) * 360 - 90
      const radian = (angle * Math.PI) / 180

      const x = 50 + Math.cos(radian) * LABEL_RADIUS
      const y = 50 + Math.sin(radian) * LABEL_RADIUS

      return {
        ...segment,
        labelStyle: {
          left: `${x}%`,
          top: `${y}%`,
        },
      }
    })
  }, [safeSegments])

  const hasDistribution = safeSegments.some((segment) => segment.percentage > 0)

  const emptyText =
    language === 'en'
      ? 'Distribution data is not available yet.'
      : 'Data distribusi belum tersedia.'

  return (
    <section className="dashboard-panel dashboard-card management-chart-card management-pie-card">
      <div className="dashboard-card-header management-card-header-centered">
        <h2>{t.managementPage.distributionTitle}</h2>
      </div>

      <div className="management-pie-wrap">
        <div className="management-pie-shell">
          <div className="management-pie" style={{ background: gradient }} />

          {chartSegments
            .filter((segment) => segment.percentage > 0)
            .map((segment) => (
              <span
                key={segment.level}
                className="management-pie-percentage"
                style={segment.labelStyle}
              >
                {segment.percentage}%
              </span>
            ))}
        </div>
      </div>

      {!hasDistribution ? (
        <p className="dashboard-card-empty">{emptyText}</p>
      ) : null}

      <div className="management-legend">
        {safeSegments.map((segment) => (
          <div key={segment.level} className="management-legend-row">
            <div className="management-legend-label">
              <span
                className={`management-legend-swatch ${toneClassMap[segment.level]}`}
              />
              <span>{t.managementPage.labels[segment.level]}</span>
            </div>

            <span>{segment.percentage}%</span>
          </div>
        ))}
      </div>
    </section>
  )
}