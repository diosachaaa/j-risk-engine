import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function SecurityStatusCard({ items = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  return (
    <section className="dashboard-panel dashboard-card compact-card">
      <div className="dashboard-card-header">
        <h2>{t.securityStatus.title}</h2>
      </div>

      <div className="status-list">
        {items.map((item) => (
          <article key={item.label} className={`status-row ${item.tone}`}>
            <span className="status-row-label">{item.label}</span>
            <div className="status-row-value-group">
              <strong>{item.value}</strong>
              <span>{item.suffix}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}