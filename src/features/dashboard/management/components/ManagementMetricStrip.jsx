import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function ManagementMetricStrip({ summary = {} }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const safeSummary = {
    total: summary?.total ?? 0,
    low: summary?.low ?? 0,
    medium: summary?.medium ?? 0,
    high: summary?.high ?? 0,
  }

  return (
    <section className="metric-strip dashboard-panel">
      <div className="metric-strip-total">
        <h2>{t.metricStrip.totalAssets}</h2>
        <strong>{safeSummary.total}</strong>
      </div>

      <div className="metric-strip-breakdown">
        <div className="metric-strip-item green">
          <span>{t.metricStrip.low}</span>
          <strong>{safeSummary.low}</strong>
        </div>

        <div className="metric-strip-item yellow">
          <span>{t.metricStrip.medium}</span>
          <strong>{safeSummary.medium}</strong>
        </div>

        <div className="metric-strip-item red">
          <span>{t.metricStrip.high}</span>
          <strong>{safeSummary.high}</strong>
        </div>
      </div>
    </section>
  )
}