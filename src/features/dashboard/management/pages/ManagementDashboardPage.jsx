import { useMemo } from 'react'

import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'
import {
  managementAssetSummary,
  managementRiskTrend,
} from '../data/managementDashboardData'
import ManagementMetricStrip from '../components/ManagementMetricStrip'
import ManagementDistributionCard from '../components/ManagementDistributionCard'
import ManagementTrendCard from '../components/ManagementTrendCard'
import ManagementInsightCard from '../components/ManagementInsightCard'

const segmentMeta = {
  low: { color: '#cfe2d0' },
  medium: { color: '#f1d9aa' },
  high: { color: '#eda1a5' },
}

export default function ManagementDashboardPage() {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const assets = Array.isArray(managementAssetSummary)
    ? managementAssetSummary
    : []

  const trendData = Array.isArray(managementRiskTrend)
    ? managementRiskTrend
    : []

  const summary = useMemo(() => {
    return assets.reduce(
      (result, asset) => {
        result.total += 1

        if (asset.level === 'low') result.low += 1
        if (asset.level === 'medium') result.medium += 1
        if (asset.level === 'high') result.high += 1

        return result
      },
      { total: 0, low: 0, medium: 0, high: 0 }
    )
  }, [assets])

  const distribution = useMemo(() => {
    return ['low', 'medium', 'high'].map((level) => ({
      level,
      value: summary[level],
      percentage:
        summary.total > 0
          ? Math.round((summary[level] / summary.total) * 100)
          : 0,
      color: segmentMeta[level].color,
    }))
  }, [summary])

  const highestAsset = useMemo(() => {
    if (assets.length === 0) return null

    return assets.reduce((currentHighest, asset) => {
      if (!currentHighest || asset.score > currentHighest.score) return asset
      return currentHighest
    }, null)
  }, [assets])

  const peakTrendPoint = useMemo(() => {
    if (trendData.length === 0) return null

    return trendData.reduce((peak, item) => {
      if (!peak || item.value > peak.value) return item
      return peak
    }, null)
  }, [trendData])

  const overallRiskAverage = useMemo(() => {
    if (trendData.length === 0) return 0

    const total = trendData.reduce((sum, item) => sum + item.value, 0)
    return Math.round(total / trendData.length)
  }, [trendData])

  const riskIncrease = useMemo(() => {
    if (trendData.length < 2) return 0

    const first = trendData[0].value
    const last = trendData[trendData.length - 1].value

    if (first === 0) return 0

    return Math.round(((last - first) / first) * 100)
  }, [trendData])

  const insights = useMemo(() => {
    return [
      {
        id: 'management-insight-01',
        segments: [
          { text: t.managementPage.insights.riskTrendStart },
          { text: `${overallRiskAverage}`, highlight: true },
          { text: t.managementPage.insights.riskTrendMiddle },
          { text: `${Math.abs(riskIncrease)}%`, highlight: true },
          { text: t.managementPage.insights.riskTrendEnd(riskIncrease >= 0) },
        ],
      },
      {
        id: 'management-insight-02',
        segments: [
          { text: t.managementPage.insights.topAssetStart },
          { text: highestAsset?.name ?? '-', highlight: true },
          { text: t.managementPage.insights.topAssetMiddle },
          { text: `${highestAsset?.score ?? 0}`, highlight: true },
          { text: t.managementPage.insights.topAssetEnd },
        ],
      },
      {
        id: 'management-insight-03',
        segments: [
          { text: t.managementPage.insights.peakDayStart },
          { text: peakTrendPoint?.label ?? '-', highlight: true },
          { text: t.managementPage.insights.peakDayMiddle },
          { text: `${peakTrendPoint?.value ?? 0}`, highlight: true },
          { text: t.managementPage.insights.peakDayEnd },
        ],
      },
      {
        id: 'management-insight-04',
        segments: [
          { text: t.managementPage.insights.priorityStart },
          { text: `${summary.high}`, highlight: true },
          { text: t.managementPage.insights.priorityMiddle },
          { text: `${summary.medium}`, highlight: true },
          { text: t.managementPage.insights.priorityEnd },
        ],
      },
    ]
  }, [highestAsset, overallRiskAverage, peakTrendPoint, riskIncrease, summary, t])

  return (
    <div className="dashboard-page dashboard-management-page">
      <div className="dashboard-content width-constrained">
        <ManagementMetricStrip summary={summary} />

        <div className="dashboard-management-grid">
          <ManagementDistributionCard segments={distribution} />
          <ManagementTrendCard data={trendData} />
        </div>

        <ManagementInsightCard insights={insights} />
      </div>
    </div>
  )
}