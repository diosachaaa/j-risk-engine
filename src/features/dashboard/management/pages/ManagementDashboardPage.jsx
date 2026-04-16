import { useEffect, useMemo, useState } from 'react'

import { getAssets, getLatestScores } from '../../shared/data/dashboardApi'
import {
  buildDashboardSummary,
  buildDistribution,
  buildManagementInsightsData,
  mergeAssetsWithScores,
} from '../../shared/data/dashboardSelectors'
import {
  buildManagementRiskTrendData,
  getManagementDashboardStateText,
} from '../data/managementDashboardData'
import ManagementMetricStrip from '../components/ManagementMetricStrip'
import ManagementDistributionCard from '../components/ManagementDistributionCard'
import ManagementTrendCard from '../components/ManagementTrendCard'
import ManagementInsightCard from '../components/ManagementInsightCard'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

export default function ManagementDashboardPage() {
  const { language = 'id' } = useLanguage()

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
              ? 'Failed to load management dashboard data.'
              : 'Gagal memuat data dashboard management.'),
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

  const distribution = useMemo(() => {
    return buildDistribution(summary)
  }, [summary])

  const trendData = useMemo(() => {
    return buildManagementRiskTrendData(rows)
  }, [rows])

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