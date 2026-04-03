import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

import dashboardText from '../dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function AssetPreviewModal({ asset, onClose }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  if (!asset) return null

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
          <strong>{asset.score}</strong>
          <span>{asset.riskLabel}</span>
        </div>

        <div className="asset-preview-name-block">
          <span>{t.assetPreview.assetName}</span>
          <h3>{asset.assetName}</h3>
        </div>

        <div className="asset-preview-block">
          <div className="asset-preview-block-title">
            {t.assetPreview.vulnerabilities}
          </div>
          <ul>
            {(asset.vulnerabilities ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="asset-preview-block danger">
          <div className="asset-preview-block-title">
            {t.assetPreview.securityAlert}
          </div>
          <ul>
            {(asset.securityAlerts ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="asset-preview-block">
          <div className="asset-preview-block-title">
            {t.assetPreview.activityLog}
          </div>
          <ul>
            {(asset.activities ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="asset-preview-updated">
          {t.assetPreview.lastUpdated} {asset.lastUpdated}
        </p>

        <Link
          to={`/dashboard/ciso/assets/${asset.id ?? 'asset-01'}`}
          className="asset-preview-link-button"
          onClick={onClose}
        >
          {t.assetPreview.viewDetail}
        </Link>
      </div>
    </div>
  )
}