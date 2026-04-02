import { ArrowLeft, Download } from 'lucide-react'

function getRiskClass(riskLevel) {
  const value = riskLevel?.toLowerCase()

  if (value === 'high') return 'high'
  if (value === 'medium') return 'medium'
  if (value === 'low') return 'low'
  return 'default'
}

export default function AssetDetailReportHeader({ asset, onBack, onDownload }) {
  const riskClass = getRiskClass(asset.riskLevel)

  return (
    <div className="asset-report-header">
      <div className="asset-report-header-top no-print">
        <button
          type="button"
          className="asset-report-back-button"
          onClick={onBack}
        >
          <span className="asset-report-back-icon">
            <ArrowLeft size={22} />
          </span>
          <span>Kembali</span>
        </button>

        <button
          type="button"
          className="asset-report-download-button"
          onClick={onDownload}
          aria-label="Unduh PDF"
          title="Unduh PDF"
        >
          <Download size={18} />
        </button>
      </div>

      <div className="asset-report-title-block">
        <h1 className="asset-report-title">Detail {asset.reportTitle || asset.name}</h1>

        <div className={`asset-report-risk-badge ${riskClass}`}>
          <div className="asset-report-risk-score">{asset.currentRiskScore}</div>
          <div className="asset-report-risk-label">{asset.riskLevel.toUpperCase()} RISK</div>
        </div>
      </div>
    </div>
  )
}