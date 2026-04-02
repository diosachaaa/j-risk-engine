function RiskHistoryTable({ rows = [] }) {
  return (
    <div className="report-table-card">
      <div className="report-table-title">Risk History (7 hari terakhir)</div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Risk Score</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={`${item.date}-${index}`}>
              <td>{item.date}</td>
              <td>{item.score}</td>
              <td>{item.status}</td>
              <td>{item.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SecurityAlertsTable({ rows = [] }) {
  return (
    <div className="report-table-card security-alerts-table-card">
      <div className="report-table-title">Security Alerts</div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Severity</th>
            <th>Alert Description</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={`${item.description}-${index}`}>
              <td>{item.severity}</td>
              <td>{item.description}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CenteredListCard({ title, items = [] }) {
  return (
    <div className="report-small-card report-centered-list-card report-wide-list-card">
      <div className="report-small-card-header">{title}</div>

      <div className="report-small-card-body report-centered-list-card-body">
        <ul className="report-bullet-list report-bullet-list--spacious report-wide-list">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function AssetSecurityReport({ asset }) {
  return (
    <section className="asset-security-report">
      <h2 className="asset-security-report-title">ASSET SECURITY REPORT</h2>

      <div className="asset-security-report-body">
        <div className="report-top-meta-grid">
          <div className="report-asset-meta">
            <div className="report-meta-row">
              <span className="report-meta-label">Asset Name</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{asset.assetName}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">Asset Type</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{asset.assetType}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">Status</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{asset.status}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">IP Address</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{asset.ipAddress}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">Last Updated</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{asset.updatedAt}</span>
            </div>
          </div>

          <div className="report-summary-note">
            <div className="report-summary-card">
              <div className="report-summary-card-header">Risk Summary</div>

              <div className="report-summary-card-body">
                <div className="report-meta-row compact">
                  <span className="report-meta-label">Current Risk Score</span>
                  <span className="report-meta-separator">:</span>
                  <span className="report-meta-value">{asset.currentRiskScore}</span>
                </div>

                <div className="report-meta-row compact">
                  <span className="report-meta-label">Risk Level</span>
                  <span className="report-meta-separator">:</span>
                  <span className="report-meta-value">
                    {asset.riskLevel?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="report-inline-note">
              <div className="report-inline-note-title">Keterangan:</div>
              <p>{asset.riskSummaryDescription}</p>
            </div>
          </div>
        </div>

        <RiskHistoryTable rows={asset.riskHistory ?? []} />

        <div className="report-analysis-text">
          <strong>Analisis:</strong>
          <p>{asset.riskHistoryAnalysis}</p>
        </div>

        <div className="report-two-column-section">
          <div className="report-small-card">
            <div className="report-small-card-header">Vulnerabilities</div>
            <div className="report-small-card-body">
              <ul className="report-bullet-list">
                {(asset.vulnerabilities ?? []).map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="report-inline-note">
            <div className="report-inline-note-title">Keterangan:</div>
            <p>{asset.vulnerabilityDescription}</p>
          </div>
        </div>

        <SecurityAlertsTable rows={asset.securityAlerts ?? []} />

        <div className="report-analysis-text">
          <div className="report-inline-note-title">Keterangan:</div>
          <p>{asset.alertDescription}</p>
        </div>

        <CenteredListCard
          title="Technical Analysis"
          items={asset.technicalAnalysis ?? []}
        />

        <CenteredListCard
          title="Recommendations"
          items={asset.recommendations ?? []}
        />

        <div className="report-conclusion">
          <strong>Konklusi</strong>
          <p>{asset.conclusion}</p>
        </div>
      </div>
    </section>
  )
}