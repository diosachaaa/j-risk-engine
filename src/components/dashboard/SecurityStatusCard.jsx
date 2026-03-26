export default function SecurityStatusCard({ items }) {
  return (
    <section className="dashboard-panel dashboard-card compact-card">
      <div className="dashboard-card-header">
        <h2>SECURITY STATUS</h2>
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
