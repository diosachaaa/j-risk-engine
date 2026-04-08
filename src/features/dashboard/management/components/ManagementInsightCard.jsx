import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function ManagementInsightCard({ insights = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const safeInsights = Array.isArray(insights) ? insights : []

  return (
    <section className="dashboard-panel dashboard-card management-insight-card">
      <div className="dashboard-card-header management-card-header-centered">
        <h2>{t.managementPage.insightTitle}</h2>
      </div>

      <ul className="management-insight-list">
        {safeInsights.map((insight, index) => (
          <li key={insight.id ?? index} className="management-insight-item">
            {(insight.segments ?? []).map((segment, segmentIndex) => (
              <span
                key={`${insight.id ?? index}-${segmentIndex}`}
                className={
                  segment.highlight ? 'technical-analysis-highlight' : ''
                }
              >
                {segment.text}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </section>
  )
}