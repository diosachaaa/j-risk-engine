import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function SecurityStatusCard({ items = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const emptyText =
    language === 'en'
      ? 'No security status data is available yet.'
      : 'Belum ada data status keamanan yang tersedia.'

  return (
    <section className="dashboard-panel dashboard-card compact-card">
      <div className="dashboard-card-header">
        <h2>{t.securityStatus.title}</h2>
      </div>

      <div className="status-list">
        {items.length > 0 ? (
          items.map((item, index) => (
            <article
              key={item.label ?? `status-${index}`}
              className={`status-row ${item.tone ?? 'yellow'}`}
            >
              <span className="status-row-label">{item.label ?? '-'}</span>
              <div className="status-row-value-group">
                <strong>{item.value ?? 0}</strong>
                <span>{item.suffix ?? ''}</span>
              </div>
            </article>
          ))
        ) : (
          <p className="dashboard-card-empty">{emptyText}</p>
        )}
      </div>
    </section>
  )
}