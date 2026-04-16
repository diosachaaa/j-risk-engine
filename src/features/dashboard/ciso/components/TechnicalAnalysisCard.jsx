import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

export default function TechnicalAnalysisCard({ points = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  return (
    <section className="dashboard-panel dashboard-card technical-analysis-card">
      <div className="dashboard-card-header">
        <h2>{t.technicalAnalysis.title}</h2>
      </div>

      {points.length > 0 ? (
        <ul className="technical-analysis-list">
          {points.map((point, index) => (
            <li key={point.id ?? index} className="technical-analysis-item">
              {(point.segments ?? []).map((segment, segmentIndex) => (
                <span
                  key={`${point.id ?? index}-${segmentIndex}`}
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
      ) : (
        <p className="technical-analysis-empty">{t.technicalAnalysis.empty}</p>
      )}
    </section>
  )
}