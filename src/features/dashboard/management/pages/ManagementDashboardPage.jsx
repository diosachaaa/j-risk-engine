import { useEffect, useMemo, useState } from 'react'

import {
  getAssets,
  getDashboardAssetsTable,
  getDashboardRiskTrend,
  getDashboardSummary,
  getLatestScores,
} from '../../shared/data/dashboardApi'
import {
  buildAssetsTableRows,
  buildDashboardSummary,
  buildDistribution,
  buildManagementInsightsData,
  mergeDashboardSummary,
  mergeAssetsWithScores,
} from '../../shared/data/dashboardSelectors'
import {
  buildManagementRiskTrendData,
  getManagementDashboardStateText,
  mapManagementRiskTrendPayload,
} from '../data/managementDashboardData'
import ManagementMetricStrip from '../components/ManagementMetricStrip'
import ManagementDistributionCard from '../components/ManagementDistributionCard'
import ManagementTrendCard from '../components/ManagementTrendCard'
import ManagementInsightCard from '../components/ManagementInsightCard'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

export default function ManagementDashboardPage() {
  const { language = 'id' } = useLanguage()

  const [rows, setRows] = useState([])
  const [riskTrendPayload, setRiskTrendPayload] = useState(null)
  const [summaryPayload, setSummaryPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      try {
        setLoading(true)
        setError('')

        const [
          assetsResponse,
          latestScoresResponse,
          dashboardSummaryResponse,
          assetsTableResponse,
          weeklyTrendResponse,
        ] = await Promise.all([
              getAssets().catch(() => []),
              getLatestScores().catch(() => []),
            getDashboardSummary().catch(() => null),
            getDashboardAssetsTable().catch(() => null),
            getDashboardRiskTrend({ params: { period: 'weekly' } }).catch(() => null),
          ])

        const mergedRows = mergeAssetsWithScores(
          assetsResponse,
          latestScoresResponse,
          { locale: language },
        )

        const assetsTableRows = buildAssetsTableRows(assetsTableResponse, {
          locale: language,
        })

        if (!isMounted) return

        setRows(assetsTableRows.length > 0 ? assetsTableRows : mergedRows)
        setSummaryPayload(dashboardSummaryResponse)
        setRiskTrendPayload(weeklyTrendResponse)
      } catch (requestError) {
        if (!isMounted) return

        setError(
          requestError?.message ||
            (language === 'en'
              ? 'Failed to load management dashboard data.'
              : 'Gagal memuat data dashboard management.'),
        )
        setRows([])
        setSummaryPayload(null)
        setRiskTrendPayload(null)
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
    return mergeDashboardSummary(buildDashboardSummary(rows), summaryPayload)
  }, [rows, summaryPayload])

  const distribution = useMemo(() => {
    return buildDistribution(summary)
  }, [summary])

  const trendData = useMemo(() => {
    const mappedTrend = mapManagementRiskTrendPayload(riskTrendPayload, language)

    if (mappedTrend.length > 0) {
      return mappedTrend
    }

    return buildManagementRiskTrendData(rows, language)
  }, [riskTrendPayload, rows, language])

  const insightData = useMemo(() => {
    return buildManagementInsightsData(rows, trendData, { locale: language })
  }, [rows, trendData, language])

  const stateText = useMemo(() => {
    return getManagementDashboardStateText({
      loading,
      error,
      rowsCount: rows.length,
      language,
    })
  }, [loading, error, rows.length, language])

  return (
    <div className="dashboard-page dashboard-management-page">
      <div className="dashboard-content width-constrained">
        {(loading || error || rows.length === 0) && (
          <section className="dashboard-panel dashboard-state-panel">
            <p>{stateText}</p>
          </section>
        )}

        <ManagementMetricStrip summary={summary} />

        <div className="dashboard-management-grid">
          <ManagementDistributionCard segments={distribution} />
          <ManagementTrendCard data={trendData} />
        </div>

        <ManagementInsightCard insights={insightData.insights ?? []} />
      </div>
    </div>
  )
}