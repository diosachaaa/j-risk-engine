import { ArrowLeft, Download } from 'lucide-react'

import { useLanguage } from '../../../shared/contexts/LanguageContext'

const TEXT = {
  id: {
    back: 'Kembali',
    downloadLabel: 'Unduh PDF',
    detailPrefix: 'Detail',
    riskSuffix: 'RISK',
  },
  en: {
    back: 'Back',
    downloadLabel: 'Download PDF',
    detailPrefix: 'Detail',
    riskSuffix: 'RISK',
  },
}

function normalizeLanguage(language = 'id') {
  return language === 'en' ? 'en' : 'id'
}

function getRiskClass(riskLevel) {
  const value = String(riskLevel ?? '').toLowerCase()

  if (value === 'high') return 'high'
  if (value === 'medium') return 'medium'
  if (value === 'low') return 'low'
  return 'default'
}

function normalizeAsset(asset = {}) {
  return {
    reportTitle: asset?.reportTitle || asset?.assetName || asset?.name || 'Asset',
    currentRiskScore: asset?.currentRiskScore ?? 0,
    riskLevel: asset?.riskLevel || 'Low',
  }
}

export default function AssetDetailReportHeader({
  asset,
  onBack,
  onDownload,
}) {
  const { language = 'id' } = useLanguage()
  const locale = normalizeLanguage(language)
  const t = TEXT[locale]

  const safeAsset = normalizeAsset(asset)
  const riskClass = getRiskClass(safeAsset.riskLevel)

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
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          className="asset-report-download-button"
          onClick={onDownload}
          aria-label={t.downloadLabel}
          title={t.downloadLabel}
        >
          <Download size={18} />
        </button>
      </div>

      <div className="asset-report-title-block">
        <h1 className="asset-report-title">
          {t.detailPrefix} {safeAsset.reportTitle}
        </h1>

        <div className={`asset-report-risk-badge ${riskClass}`}>
          <div className="asset-report-risk-score">
            {safeAsset.currentRiskScore}
          </div>
          <div className="asset-report-risk-label">
            {String(safeAsset.riskLevel).toUpperCase()} {t.riskSuffix}
          </div>
        </div>
      </div>
    </div>
  )
}