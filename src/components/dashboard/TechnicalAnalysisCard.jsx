export default function TechnicalAnalysisCard({ points = [] }) {
  return (
    <section className="dashboard-panel dashboard-card technical-analysis-card">
      <div className="dashboard-card-header">
        <h2>TECHNICAL ANALYSIS</h2>
      </div>

      <ul className="technical-analysis-list">
        {points.map((point, index) => (
          <li key={point.id ?? index} className="technical-analysis-item">
            {(point.segments ?? []).map((segment, segmentIndex) => (
              <span
                key={segmentIndex}
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