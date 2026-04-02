import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import AppTopbar from '../../../components/common/AppTopbar'
import AssetSecurityReport from '../../../components/dashboard/AssetSecurityReport'
import { assetDetailData } from '../../../data/assetDetailData'
import '../../../styles/asset-detail.css'

function getRiskClass(riskLevel) {
  const value = riskLevel?.toLowerCase()

  if (value === 'high') return 'high'
  if (value === 'medium') return 'medium'
  if (value === 'low') return 'low'
  return 'default'
}

export default function AssetDetailPage() {
  const navigate = useNavigate()
  const { assetId } = useParams()

  const asset = useMemo(() => {
    return {
      ...assetDetailData,
      id: assetId || assetDetailData.id,
    }
  }, [assetId])

  const riskClass = getRiskClass(asset.riskLevel)

  const handleDownloadPdf = () => {
    window.print()
  }

  return (
    <div className="asset-detail-page">
      <AppTopbar />

      <div className="asset-detail-breadcrumb-bar">
        <span>CISO Dashboard / Detail Asset</span>
        <div className="asset-detail-user">
          <span>Budi Santoso</span>
          <div className="asset-detail-user-avatar" />
        </div>
      </div>

      <div className="asset-detail-content">
        <div className="asset-detail-actions-row no-print">
          <button
            type="button"
            className="asset-detail-back-button"
            onClick={() => navigate(-1)}
          >
            <span className="asset-detail-icon-circle">
              <ArrowLeft size={22} />
            </span>
            <span>Kembali</span>
          </button>

          <button
            type="button"
            className="asset-detail-download-button"
            onClick={handleDownloadPdf}
          >
            <span>Unduh</span>
            <span className="asset-detail-icon-circle">
              <Download size={22} />
            </span>
          </button>
        </div>

        <div className="asset-detail-hero">
          <h1 className="asset-detail-title">Detail {asset.id}</h1>

          <div className={`asset-detail-risk-badge ${riskClass}`}>
            <div className="asset-detail-risk-score">{asset.currentRiskScore}</div>
            <div className="asset-detail-risk-level">{asset.riskLevel} RISK</div>
          </div>
        </div>

        <div className="asset-detail-divider" />

        <AssetSecurityReport asset={asset} />

        <div className="asset-detail-bottom-divider" />
      </div>
    </div>
  )
}