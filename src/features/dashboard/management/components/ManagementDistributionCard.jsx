import { useMemo } from 'react'

import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

const toneClassMap = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
}

export default function ManagementDistributionCard({ segments = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const safeSegments = Array.isArray(segments) ? segments : []

  const totalPercentage = safeSegments.reduce(
    (total, item) => total + (item.percentage || 0),
    0
  )

  const normalizedSegments =
    totalPercentage > 0
      ? safeSegments
      : [
          {
            level: 'low',
            percentage: 0,
            color: '#cfe2d0',
          },
          {
            level: 'medium',
            percentage: 0,
            color: '#f1d9aa',
          },
          {
            level: 'high',
            percentage: 0,
            color: '#eda1a5',
          },
        ]

  const gradient =
    totalPercentage > 0
      ? `conic-gradient(${normalizedSegments
          .map((segment, index) => {
            const previousTotal = normalizedSegments
              .slice(0, index)
              .reduce((total, item) => total + item.percentage, 0)
            const nextTotal = previousTotal + segment.percentage

            return `${segment.color} ${previousTotal}% ${nextTotal}%`
          })
          .join(', ')})`
      : 'conic-gradient(#f2f2f2 0% 100%)'

  const chartSegments = useMemo(() => {
    const LABEL_RADIUS = 58

    return normalizedSegments.map((segment, index) => {
      const previousTotal = normalizedSegments
        .slice(0, index)
        .reduce((total, item) => total + item.percentage, 0)

      const middlePercent = previousTotal + segment.percentage / 2
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
  }, [normalizedSegments])

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

      <div className="management-legend">
        {normalizedSegments.map((segment) => (
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