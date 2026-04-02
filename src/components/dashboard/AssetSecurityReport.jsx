function InfoRow({ label, value }) {
  return (
    <div className="asset-report-info-row">
      <span className="asset-report-info-label">{label}</span>
      <span className="asset-report-info-separator">:</span>
      <span className="asset-report-info-value">{value}</span>
    </div>
  )
}

function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`asset-report-card ${className}`}>
      <div className="asset-report-card-header">{title}</div>
      <div className="asset-report-card-body">{children}</div>
    </div>
  )
}

export default function AssetSecurityReport({ asset }) {
  return (
    <section className="asset-report" id="asset-report-pdf">
      <h2 className="asset-report-title">ASSET SECURITY REPORT</h2>

      <div className="asset-report-top">
        <div className="asset-report-top-left">
          <div className="asset-report-info">
            <InfoRow label="Asset Name" value={asset.name} />
            <InfoRow label="Asset Type" value={asset.type} />
            <InfoRow label="Status" value={asset.status} />
            <InfoRow label="IP Address" value={asset.ipAddress} />
            <InfoRow label="Last Updated" value={asset.lastUpdated} />
          </div>

          <SectionCard title="Risk Summary">
            <InfoRow label="Current Risk Score" value={asset.currentRiskScoreReport} />
            <InfoRow label="Risk Level" value={asset.riskLevel} />
          </SectionCard>
        </div>

        <div className="asset-report-top-right">
          <div className="asset-report-note-title">Keterangan:</div>
          <p className="asset-report-paragraph">{asset.summary}</p>
        </div>
      </div>

      <SectionCard title="Risk History (7 hari terakhir)">
        <div className="asset-report-table-wrapper">
          <table className="asset-report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {asset.riskHistory.map((item, index) => (
                <tr key={`${item.date}-${index}`}>
                  <td>{item.date}</td>
                  <td>{item.riskScore}</td>
                  <td>{item.status}</td>
                  <td>{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="asset-report-analysis">
        <div className="asset-report-note-title">Analisis:</div>
        <p className="asset-report-paragraph">{asset.analysis}</p>
      </div>

      <div className="asset-report-grid-2">
        <SectionCard title="Vulnerabilities">
          <ul className="asset-report-list">
            {asset.vulnerabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SectionCard>

        <div className="asset-report-text-block">
          <div className="asset-report-note-title">Keterangan:</div>
          <p className="asset-report-paragraph">{asset.vulnerabilityDescription}</p>
        </div>
      </div>

      <SectionCard title="Security Alerts" className="asset-report-alerts-card">
        <div className="asset-report-table-wrapper">
          <table className="asset-report-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Alert Description</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {asset.securityAlerts.map((alert, index) => (
                <tr key={`${alert.severity}-${index}`}>
                  <td>{alert.severity}</td>
                  <td>{alert.description}</td>
                  <td>{alert.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="asset-report-analysis">
        <div className="asset-report-note-title">Keterangan:</div>
        <p className="asset-report-paragraph">{asset.alertDescription}</p>
      </div>

      <SectionCard title="Technical Analysis" className="asset-report-center-card">
        <ul className="asset-report-list">
          {asset.technicalAnalysis.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Recommendations" className="asset-report-center-card">
        <ul className="asset-report-list">
          {asset.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionCard>

      <div className="asset-report-conclusion">
        <div className="asset-report-note-title">Konklusi</div>
        <p className="asset-report-paragraph asset-report-justify">{asset.conclusion}</p>
      </div>
    </section>
  )
}