export default function RecentAlertCard({ alerts }) {
  return (
    <section className="dashboard-panel dashboard-card compact-card">
      <div className="dashboard-card-header">
        <h2>RECENT ALERT</h2>
      </div>

      <div className="alert-list">
        {alerts.map((alert) => (
          <article key={alert.id} className={`alert-row ${alert.tone}`}>
            <div className="alert-row-main">
              <span>{alert.title}</span>
              {alert.severity ? <span className="alert-pill">{alert.severity}</span> : null}
            </div>
            <span className="alert-row-time">{alert.time}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
