import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

import dashboardText from '../dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

function renderList(items = [], emptyText = '-') {
  if (!Array.isArray(items) || items.length === 0) {
    return <li>{emptyText}</li>
  }

  return items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)
}

export default function AssetPreviewModal({
  open = false,
  asset = null,
  onClose,
}) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  if (!open || !asset) return null

  const emptyVulnerabilities =
    language === 'en'
      ? 'No vulnerability details available yet'
      : 'Belum ada detail kerentanan yang tersedia'

  const emptyAlerts =
    language === 'en'
      ? 'No alert details available yet'
      : 'Belum ada detail alert yang tersedia'

  const emptyActivities =
    language === 'en'
      ? 'No activity log available yet'
      : 'Belum ada activity log yang tersedia'

  return (
    <div className="asset-preview-overlay" onClick={onClose}>
      <div
        className="asset-preview-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="asset-preview-header">
          <h2>{t.assetPreview.title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.assetPreview.closeLabel}
          >
            <X size={24} />
          </button>
        </div>

        <div className="asset-preview-score-box">
          <strong>{asset.score ?? 0}</strong>
          <span>{asset.riskLabel ?? '-'}</span>
        </div>

        <div className="asset-preview-name-block">
          <span>{t.assetPreview.assetName}</span>
          <h3>{asset.assetName ?? '-'}</h3>
        </div>

        <div className="asset-preview-block">
          <div className="asset-preview-block-title">
            {t.assetPreview.vulnerabilities}
          </div>
          <ul>{renderList(asset.vulnerabilities, emptyVulnerabilities)}</ul>
        </div>

        <div className="asset-preview-block danger">
          <div className="asset-preview-block-title">
            {t.assetPreview.securityAlert}
          </div>
          <ul>{renderList(asset.securityAlerts, emptyAlerts)}</ul>
        </div>

        <div className="asset-preview-block">
          <div className="asset-preview-block-title">
            {t.assetPreview.activityLog}
          </div>
          <ul>{renderList(asset.activities, emptyActivities)}</ul>
        </div>

        <p className="asset-preview-updated">
          {t.assetPreview.lastUpdated} {asset.lastUpdated ?? '-'}
        </p>

        <Link
          to={`/dashboard/ciso/assets/${asset.id ?? asset.assetId ?? 'asset-01'}`}
          className="asset-preview-link-button"
          onClick={onClose}
        >
          {t.assetPreview.viewDetail}
        </Link>
      </div>
    </div>
  )
}