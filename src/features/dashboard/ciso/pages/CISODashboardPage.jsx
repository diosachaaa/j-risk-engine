import { useEffect, useMemo, useState } from 'react'

import {
  buildCisoRecentAlerts,
  buildCisoRiskTrendData,
  buildPreviewAssetData,
  getCisoDashboardStateText,
} from '../data/dashboardData'
import { getAssets, getLatestScores } from '../../shared/data/dashboardApi'
import {
  buildDashboardSummary,
  buildSecurityStatusItems,
  buildTechnicalAnalysisPoints,
  buildTopRiskRows,
  mergeAssetsWithScores,
} from '../../shared/data/dashboardSelectors'
import AssetPreviewModal from '../../shared/components/AssetPreviewModal'
import MetricStrip from '../components/MetricStrip'
import RecentAlertCard from '../components/RecentAlertCard'
import RiskTrendCard from '../components/RiskTrendCard'
import SecurityStatusCard from '../components/SecurityStatusCard'
import TechnicalAnalysisCard from '../components/TechnicalAnalysisCard'
import TopRiskTable from '../components/TopRiskTable'
import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function CISODashboardPage() {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const [selectedRow, setSelectedRow] = useState(null)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      try {
        setLoading(true)
        setError('')

        const [assetsResponse, latestScoresResponse] = await Promise.all([
          getAssets(),
          getLatestScores(),
        ])

        const mergedRows = mergeAssetsWithScores(
          assetsResponse,
          latestScoresResponse,
          { locale: language },
        )

        if (!isMounted) return

        setRows(mergedRows)
      } catch (requestError) {
        if (!isMounted) return

        setError(
          requestError?.message ||
            (language === 'en'
              ? 'Failed to load dashboard data.'
              : 'Gagal memuat data dashboard.'),
        )
        setRows([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isMounted = false
    }
  }, [language])

  const summary = useMemo(() => {
    return buildDashboardSummary(rows)
  }, [rows])

  const securityStatusItems = useMemo(() => {
    return buildSecurityStatusItems(summary, language)
  }, [summary, language])

  const topRiskRows = useMemo(() => {
    return buildTopRiskRows(rows, 10)
  }, [rows])

  const technicalAnalysisPoints = useMemo(() => {
    return buildTechnicalAnalysisPoints(rows, language)
  }, [rows, language])

  const recentAlerts = useMemo(() => {
    return buildCisoRecentAlerts(rows, language)
  }, [rows, language])

  const riskTrendData = useMemo(() => {
    return buildCisoRiskTrendData(rows)
  }, [rows])

  const previewData = useMemo(() => {
    return buildPreviewAssetData(selectedRow, language)
  }, [selectedRow, language])

  const stateText = useMemo(() => {
    return getCisoDashboardStateText({
      loading,
      error,
      rowsCount: rows.length,
      language,
    })
  }, [loading, error, rows.length, language])

  return (
    <div className="dashboard-page dashboard-ciso-page">
      <div className="dashboard-content width-constrained">
        {(loading || error || rows.length === 0) && (
          <section className="dashboard-panel dashboard-state-panel">
            <p>{stateText}</p>
          </section>
        )}

        <MetricStrip summary={summary} />
        <RiskTrendCard data={riskTrendData} />

        <div className="dashboard-two-column-grid">
          <SecurityStatusCard items={securityStatusItems} />
          <RecentAlertCard alerts={recentAlerts} />
        </div>

        <TopRiskTable rows={topRiskRows} onOpenPreview={setSelectedRow} />

        <TechnicalAnalysisCard points={technicalAnalysisPoints ?? []} />
      </div>

      <AssetPreviewModal
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
        asset={previewData}
      />
    </div>
  )
}