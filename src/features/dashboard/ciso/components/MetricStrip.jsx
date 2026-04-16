import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

export default function MetricStrip({ summary = {} }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const total = summary.total ?? 0
  const low = summary.low ?? 0
  const medium = summary.medium ?? 0
  const high = summary.high ?? 0

  return (
    <section className="metric-strip dashboard-panel">
      <div className="metric-strip-total">
        <h2>{t.metricStrip.totalAssets}</h2>
        <strong>{total}</strong>
      </div>

      <div className="metric-strip-breakdown">
        <div className="metric-strip-item green">
          <span>{t.metricStrip.low}</span>
          <strong>{low}</strong>
        </div>
        <div className="metric-strip-item yellow">
          <span>{t.metricStrip.medium}</span>
          <strong>{medium}</strong>
        </div>
        <div className="metric-strip-item red">
          <span>{t.metricStrip.high}</span>
          <strong>{high}</strong>
        </div>
      </div>
    </section>
  )
}