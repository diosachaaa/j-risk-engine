export default function TechnicalAnalysisCard({ points }) {
  return (
    <section className="dashboard-panel dashboard-card technical-analysis-card">
      <div className="dashboard-card-header">
        <h2>TECHNICAL ANALYSIS</h2>
      </div>

      <ul className="technical-analysis-list">
        {points.map((point) => {

        })}
      </ul>
    </section>
  )
}
