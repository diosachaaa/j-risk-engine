import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AssetDetailReportHeader from '../../../components/asset-detail/AssetDetailReportHeader'
import AssetSecurityReport from '../../../components/asset-detail/AssetSecurityReport'
import { getAssetDetailById, getFallbackAssetDetail } from '../../../data/assetDetailData'
import '../../../styles/asset-detail.css'

export default function AssetDetailPage() {
  const navigate = useNavigate()
  const { assetId } = useParams()

  const asset = useMemo(() => {
    return getAssetDetailById(assetId) ?? getFallbackAssetDetail(assetId)
  }, [assetId])

  const handleDownloadPdf = () => {
    window.print()
  }

  return (
    <div className="asset-detail-page">
      <div className="asset-detail-paper width-constrained">
        <AssetDetailReportHeader
          asset={asset}
          onBack={() => navigate(-1)}
          onDownload={handleDownloadPdf}
        />

        <div className="asset-detail-paper-divider" />

        <AssetSecurityReport asset={asset} />

        <div className="asset-detail-paper-divider bottom" />
      </div>
    </div>
  )
}