import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AssetDetailReportHeader from '../components/AssetDetailReportHeader'
import AssetSecurityReport from '../components/AssetSecurityReport'
import {
  getAssetDetail,
  getAssetScore,
  getAssetTrend,
} from '../data/assetDetailApi'
import { buildAssetDetailViewModel } from '../data/assetDetailMappers'
import { getFallbackAssetDetail } from '../data/assetDetailData'
import { useLanguage } from '../../../shared/contexts/useLanguage'

export default function AssetDetailPage() {
  const navigate = useNavigate()
  const { assetId } = useParams()
  const { language = 'id' } = useLanguage()

  const [asset, setAsset] = useState(() => getFallbackAssetDetail(assetId))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAssetDetail() {
      if (!assetId) {
        if (!isMounted) return

        setAsset(getFallbackAssetDetail('asset-01'))
        setError(
          language === 'en'
            ? 'Asset ID is not available.'
            : 'Asset ID tidak tersedia.',
        )
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const [assetResponse, scoreResponse, trendResponse] = await Promise.all([
          getAssetDetail(assetId),
          getAssetScore(assetId),
          getAssetTrend(assetId),
        ])

        const normalizedAsset = buildAssetDetailViewModel({
          asset: assetResponse,
          score: scoreResponse,
          trend: trendResponse,
          fallbackId: assetId,
          locale: language,
        })

        if (!isMounted) return

        setAsset(normalizedAsset)
      } catch (requestError) {
        if (!isMounted) return

        setAsset(getFallbackAssetDetail(assetId))
        setError(
          requestError?.message ||
            (language === 'en'
              ? 'Failed to load asset detail data.'
              : 'Gagal memuat data detail aset.'),
        )
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAssetDetail()

    return () => {
      isMounted = false
    }
  }, [assetId, language])

  const handleDownloadPdf = () => {
    window.print()
  }

  const stateText = loading
    ? language === 'en'
      ? 'Loading asset detail data...'
      : 'Sedang memuat data detail aset...'
    : error

  return (
    <div className="asset-detail-page">
      <div className="asset-detail-paper width-constrained">
        {(loading || error) && (
          <section className="dashboard-panel dashboard-state-panel">
            <p>{stateText}</p>
          </section>
        )}

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