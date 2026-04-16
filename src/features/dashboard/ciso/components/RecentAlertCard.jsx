import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

export default function RecentAlertCard({ alerts = [] }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const emptyText =
    language === 'en'
      ? 'No recent alerts are available yet.'
      : 'Belum ada alert terbaru yang tersedia.'

  return (
    <section className="dashboard-panel dashboard-card compact-card">
      <div className="dashboard-card-header">
        <h2>{t.recentAlert.title}</h2>
      </div>

      <div className="alert-list">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <article
              key={alert.id ?? `${alert.title ?? 'alert'}-${index}`}
              className={`alert-row ${alert.tone ?? 'yellow'}`}
            >
              <div className="alert-row-main">
                <span>{alert.title ?? '-'}</span>
                {alert.severity ? (
                  <span className="alert-pill">{alert.severity}</span>
                ) : null}
              </div>
              <span className="alert-row-time">{alert.time ?? '-'}</span>
            </article>
          ))
        ) : (
          <p className="dashboard-card-empty">{emptyText}</p>
        )}
      </div>
    </section>
  )
}