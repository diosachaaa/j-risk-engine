// src/components/dashboard/AssetPreviewModal.jsx
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'

export default function AssetPreviewModal({ asset, onClose }) {
  if (!asset) return null

  return (
    <div className="asset-preview-overlay" onClick={onClose}>
      <div
        className="asset-preview-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="asset-preview-header">
          <h2>Detail Aset</h2>

          <button type="button" onClick={onClose} aria-label="Tutup detail aset">
            <X size={24} />
          </button>
        </div>

        <div className="asset-preview-score-box">
          <strong>{asset.score}</strong>
          <span>{asset.riskLabel}</span>
        </div>

        <div className="asset-preview-name-block">
          <span>Asset Name</span>
          <h3>{asset.assetName}</h3>
        </div>

        <div className="asset-preview-block">
          <div className="asset-preview-block-title">Vulnerabilities</div>
          <ul>
            {asset.vulnerabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="asset-preview-block danger">
          <div className="asset-preview-block-title">Security Alert</div>
          <ul>
            {asset.securityAlerts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="asset-preview-block">
          <div className="asset-preview-block-title">Activity Log</div>
          <ul>
            {asset.activities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="asset-preview-updated">Last updated: {asset.lastUpdated}</p>

        <Link
          to={`/dashboard/ciso/assets/${asset.id ?? 'asset-01'}`}
          className="asset-preview-link-button"
          onClick={onClose}
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  )
}