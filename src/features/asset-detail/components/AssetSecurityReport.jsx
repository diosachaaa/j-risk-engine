import { useLanguage } from '../../../shared/contexts/useLanguage'

const TEXT = {
  id: {
    title: 'ASSET SECURITY REPORT',
    riskHistoryTitle: 'Risk History (7 hari terakhir)',
    securityAlertsTitle: 'Security Alerts',
    technicalAnalysisTitle: 'Technical Analysis',
    recommendationsTitle: 'Recommendations',
    assetName: 'Asset Name',
    assetType: 'Asset Type',
    status: 'Status',
    ipAddress: 'IP Address',
    lastUpdated: 'Last Updated',
    riskSummary: 'Risk Summary',
    currentRiskScore: 'Current Risk Score',
    riskLevel: 'Risk Level',
    note: 'Keterangan:',
    analysis: 'Analisis:',
    vulnerabilities: 'Vulnerabilities',
    conclusion: 'Konklusi',
    noHistory: 'Belum ada riwayat risiko yang tersedia.',
    noVulnerabilities: 'Belum ada data kerentanan yang tersedia.',
    noAlerts: 'Belum ada data alert keamanan yang tersedia.',
    noItems: 'Belum ada data yang tersedia.',
    historyHeaders: {
      date: 'Date',
      riskScore: 'Risk Score',
      status: 'Status',
      detail: 'Detail',
    },
    alertHeaders: {
      severity: 'Severity',
      description: 'Alert Description',
      time: 'Time',
    },
  },
  en: {
    title: 'ASSET SECURITY REPORT',
    riskHistoryTitle: 'Risk History (Last 7 Days)',
    securityAlertsTitle: 'Security Alerts',
    technicalAnalysisTitle: 'Technical Analysis',
    recommendationsTitle: 'Recommendations',
    assetName: 'Asset Name',
    assetType: 'Asset Type',
    status: 'Status',
    ipAddress: 'IP Address',
    lastUpdated: 'Last Updated',
    riskSummary: 'Risk Summary',
    currentRiskScore: 'Current Risk Score',
    riskLevel: 'Risk Level',
    note: 'Notes:',
    analysis: 'Analysis:',
    vulnerabilities: 'Vulnerabilities',
    conclusion: 'Conclusion',
    noHistory: 'No risk history is available yet.',
    noVulnerabilities: 'No vulnerability data is available yet.',
    noAlerts: 'No security alert data is available yet.',
    noItems: 'No data is available yet.',
    historyHeaders: {
      date: 'Date',
      riskScore: 'Risk Score',
      status: 'Status',
      detail: 'Detail',
    },
    alertHeaders: {
      severity: 'Severity',
      description: 'Alert Description',
      time: 'Time',
    },
  },
}

function normalizeLanguage(language = 'id') {
  return language === 'en' ? 'en' : 'id'
}

function normalizeAsset(asset = {}) {
  return {
    assetName: asset?.assetName || '-',
    assetType: asset?.assetType || '-',
    status: asset?.status || '-',
    ipAddress: asset?.ipAddress || '-',
    updatedAt: asset?.updatedAt || '-',
    currentRiskScore: asset?.currentRiskScore ?? 0,
    riskLevel: asset?.riskLevel || '-',
    riskSummaryDescription: asset?.riskSummaryDescription || '-',
    riskHistory: Array.isArray(asset?.riskHistory) ? asset.riskHistory : [],
    riskHistoryAnalysis: asset?.riskHistoryAnalysis || '-',
    vulnerabilities: Array.isArray(asset?.vulnerabilities)
      ? asset.vulnerabilities
      : [],
    vulnerabilityDescription: asset?.vulnerabilityDescription || '-',
    securityAlerts: Array.isArray(asset?.securityAlerts)
      ? asset.securityAlerts
      : [],
    alertDescription: asset?.alertDescription || '-',
    technicalAnalysis: Array.isArray(asset?.technicalAnalysis)
      ? asset.technicalAnalysis
      : [],
    recommendations: Array.isArray(asset?.recommendations)
      ? asset.recommendations
      : [],
    conclusion: asset?.conclusion || '-',
  }
}

function EmptyRow({ colSpan = 1, text = '-' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="top-risk-empty-state">
        {text}
      </td>
    </tr>
  )
}

function RiskHistoryTable({ rows = [], t }) {
  return (
    <div className="report-table-card">
      <div className="report-table-title">{t.riskHistoryTitle}</div>

      <table className="report-table">
        <thead>
          <tr>
            <th>{t.historyHeaders.date}</th>
            <th>{t.historyHeaders.riskScore}</th>
            <th>{t.historyHeaders.status}</th>
            <th>{t.historyHeaders.detail}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item, index) => (
              <tr key={`${item.date ?? 'history'}-${index}`}>
                <td>{item.date ?? '-'}</td>
                <td>{item.score ?? '-'}</td>
                <td>{item.status ?? '-'}</td>
                <td>{item.detail ?? '-'}</td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={4} text={t.noHistory} />
          )}
        </tbody>
      </table>
    </div>
  )
}

function SecurityAlertsTable({ rows = [], t }) {
  return (
    <div className="report-table-card security-alerts-table-card">
      <div className="report-table-title">{t.securityAlertsTitle}</div>

      <table className="report-table">
        <thead>
          <tr>
            <th>{t.alertHeaders.severity}</th>
            <th>{t.alertHeaders.description}</th>
            <th>{t.alertHeaders.time}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item, index) => (
              <tr key={`${item.description ?? 'alert'}-${index}`}>
                <td>{item.severity ?? '-'}</td>
                <td>{item.description ?? '-'}</td>
                <td>{item.time ?? '-'}</td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={3} text={t.noAlerts} />
          )}
        </tbody>
      </table>
    </div>
  )
}

function CenteredListCard({ title, items = [], emptyText }) {
  return (
    <div className="report-small-card report-centered-list-card report-wide-list-card">
      <div className="report-small-card-header">{title}</div>

      <div className="report-small-card-body report-centered-list-card-body">
        {items.length > 0 ? (
          <ul className="report-bullet-list report-bullet-list--spacious report-wide-list">
            {items.map((item, index) => (
              <li key={`${title}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="technical-analysis-empty">{emptyText}</p>
        )}
      </div>
    </div>
  )
}

export default function AssetSecurityReport({ asset }) {
  const { language = 'id' } = useLanguage()
  const locale = normalizeLanguage(language)
  const t = TEXT[locale]
  const safeAsset = normalizeAsset(asset)

  return (
    <section className="asset-security-report">
      <h2 className="asset-security-report-title">{t.title}</h2>

      <div className="asset-security-report-body">
        <div className="report-top-meta-grid">
          <div className="report-asset-meta">
            <div className="report-meta-row">
              <span className="report-meta-label">{t.assetName}</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{safeAsset.assetName}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">{t.assetType}</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{safeAsset.assetType}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">{t.status}</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{safeAsset.status}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">{t.ipAddress}</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{safeAsset.ipAddress}</span>
            </div>

            <div className="report-meta-row">
              <span className="report-meta-label">{t.lastUpdated}</span>
              <span className="report-meta-separator">:</span>
              <span className="report-meta-value">{safeAsset.updatedAt}</span>
            </div>
          </div>

          <div className="report-summary-note">
            <div className="report-summary-card">
              <div className="report-summary-card-header">{t.riskSummary}</div>

              <div className="report-summary-card-body">
                <div className="report-meta-row compact">
                  <span className="report-meta-label">{t.currentRiskScore}</span>
                  <span className="report-meta-separator">:</span>
                  <span className="report-meta-value">
                    {safeAsset.currentRiskScore}
                  </span>
                </div>

                <div className="report-meta-row compact">
                  <span className="report-meta-label">{t.riskLevel}</span>
                  <span className="report-meta-separator">:</span>
                  <span className="report-meta-value">
                    {String(safeAsset.riskLevel).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="report-inline-note">
              <div className="report-inline-note-title">{t.note}</div>
              <p>{safeAsset.riskSummaryDescription}</p>
            </div>
          </div>
        </div>

        <RiskHistoryTable rows={safeAsset.riskHistory} t={t} />

        <div className="report-analysis-text">
          <strong>{t.analysis}</strong>
          <p>{safeAsset.riskHistoryAnalysis}</p>
        </div>

        <div className="report-two-column-section">
          <div className="report-small-card">
            <div className="report-small-card-header">{t.vulnerabilities}</div>
            <div className="report-small-card-body">
              {safeAsset.vulnerabilities.length > 0 ? (
                <ul className="report-bullet-list">
                  {safeAsset.vulnerabilities.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="technical-analysis-empty">{t.noVulnerabilities}</p>
              )}
            </div>
          </div>

          <div className="report-inline-note">
            <div className="report-inline-note-title">{t.note}</div>
            <p>{safeAsset.vulnerabilityDescription}</p>
          </div>
        </div>

        <SecurityAlertsTable rows={safeAsset.securityAlerts} t={t} />

        <div className="report-analysis-text">
          <div className="report-inline-note-title">{t.note}</div>
          <p>{safeAsset.alertDescription}</p>
        </div>

        <CenteredListCard
          title={t.technicalAnalysisTitle}
          items={safeAsset.technicalAnalysis}
          emptyText={t.noItems}
        />

        <CenteredListCard
          title={t.recommendationsTitle}
          items={safeAsset.recommendations}
          emptyText={t.noItems}
        />

        <div className="report-conclusion">
          <strong>{t.conclusion}</strong>
          <p>{safeAsset.conclusion}</p>
        </div>
      </div>
    </section>
  )
}