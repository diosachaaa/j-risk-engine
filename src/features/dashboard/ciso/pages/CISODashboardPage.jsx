import { useMemo, useState } from 'react'

import {
  assetRows,
  previewAssetDetail,
  recentAlerts,
  riskTrendData,
  securityStatusData,
  technicalAnalysisPoints,
} from '../data/dashboardData'
import AssetPreviewModal from '../../shared/components/AssetPreviewModal'
import MetricStrip from '../components/MetricStrip'
import RecentAlertCard from '../components/RecentAlertCard'
import RiskTrendCard from '../components/RiskTrendCard'
import SecurityStatusCard from '../components/SecurityStatusCard'
import TechnicalAnalysisCard from '../components/TechnicalAnalysisCard'
import TopRiskTable from '../components/TopRiskTable'

export default function CISODashboardPage() {
  const [selectedRow, setSelectedRow] = useState(null)

  const previewData = useMemo(() => {
    if (!selectedRow) return null

    return {
      ...previewAssetDetail,
      assetName: selectedRow.name,
      score: selectedRow.score,
      riskLabel: selectedRow.status === 'Tinggi' ? 'HIGH RISK' : 'MEDIUM RISK',
      lastUpdated: selectedRow.updatedAt,
    }
  }, [selectedRow])

  return (
    <div className="dashboard-page dashboard-ciso-page">
      <div className="dashboard-content width-constrained">
        <MetricStrip />
        <RiskTrendCard data={riskTrendData} />

        <div className="dashboard-two-column-grid">
          <SecurityStatusCard items={securityStatusData} />
          <RecentAlertCard alerts={recentAlerts} />
        </div>

        <TopRiskTable rows={assetRows} onOpenPreview={setSelectedRow} />

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