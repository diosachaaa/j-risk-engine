import { useEffect, useMemo, useState } from 'react';

import {
  buildCisoRecentAlerts,
  buildCisoRiskTrendData,
  buildPreviewAssetData,
  getCisoDashboardStateText,
} from '../data/dashboardData';
import {
  getAssets,
  getDashboardAssetsTable,
  getDashboardRiskTrend,
  getDashboardSummary,
  getLatestScores,
} from '../../shared/data/dashboardApi';
import {
  buildAssetsTableRows,
  buildDashboardSummary,
  mergeDashboardSummary,
  buildSecurityStatusItems,
  buildTechnicalAnalysisPoints,
  buildTopRiskRows,
  mergeAssetsWithScores,
} from '../../shared/data/dashboardSelectors';
import AssetPreviewModal from '../../shared/components/AssetPreviewModal';
import MetricStrip from '../components/MetricStrip';
import RecentAlertCard from '../components/RecentAlertCard';
import RiskTrendCard from '../components/RiskTrendCard';
import SecurityStatusCard from '../components/SecurityStatusCard';
import TechnicalAnalysisCard from '../components/TechnicalAnalysisCard';
import TopRiskTable from '../components/TopRiskTable';
import { useLanguage } from '../../../../shared/contexts/useLanguage';

export default function CISODashboardPage() {
  const { language = 'id' } = useLanguage();

  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [assetsTablePayload, setAssetsTablePayload] = useState(null);
  const [riskTrendPayloadByPeriod, setRiskTrendPayloadByPeriod] = useState({});
  const [summaryPayload, setSummaryPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');

        const [
          assetsResponse,
          latestScoresResponse,
          dashboardSummaryResponse,
          assetsTableResponse,
          dailyTrendResponse,
          weeklyTrendResponse,
          monthlyTrendResponse,
          yearlyTrendResponse,
        ] = await Promise.all([
            getAssets().catch(() => []),
            getLatestScores().catch(() => []),
            getDashboardSummary().catch(() => null),
            getDashboardAssetsTable().catch(() => null),
            getDashboardRiskTrend({ params: { period: 'daily' } }).catch(() => null),
            getDashboardRiskTrend({ params: { period: 'weekly' } }).catch(() => null),
            getDashboardRiskTrend({ params: { period: 'monthly' } }).catch(() => null),
            getDashboardRiskTrend({ params: { period: 'yearly' } }).catch(() => null),
          ]);

        const mergedRows = mergeAssetsWithScores(
          assetsResponse,
          latestScoresResponse,
          { locale: language },
        );

        if (!isMounted) return;

        setRows(mergedRows);
        setSummaryPayload(dashboardSummaryResponse);
        setAssetsTablePayload(assetsTableResponse);
        setRiskTrendPayloadByPeriod({
          daily: dailyTrendResponse,
          weekly: weeklyTrendResponse,
          monthly: monthlyTrendResponse,
          yearly: yearlyTrendResponse,
        });
      } catch (requestError) {
        if (!isMounted) return;

        setError(
          requestError?.message ||
            (language === 'en'
              ? 'Failed to load dashboard data.'
              : 'Gagal memuat data dashboard.'),
        );
        setRows([]);
        setSummaryPayload(null);
        setAssetsTablePayload(null);
        setRiskTrendPayloadByPeriod({});
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const summary = useMemo(() => {
    return mergeDashboardSummary(buildDashboardSummary(rows), summaryPayload);
  }, [rows, summaryPayload]);

  const assetsTableRows = useMemo(() => {
    return buildAssetsTableRows(assetsTablePayload, { locale: language });
  }, [assetsTablePayload, language]);

  const securityStatusItems = useMemo(() => {
    return buildSecurityStatusItems(summary, language);
  }, [summary, language]);

  const topRiskRows = useMemo(() => {
    const sourceRows = assetsTableRows.length > 0 ? assetsTableRows : rows;

    return buildTopRiskRows(sourceRows, 10);
  }, [assetsTableRows, rows]);

  const technicalAnalysisPoints = useMemo(() => {
    return buildTechnicalAnalysisPoints(rows, language);
  }, [rows, language]);

  const recentAlerts = useMemo(() => {
    return buildCisoRecentAlerts(rows, language);
  }, [rows, language]);

  const riskTrendData = useMemo(() => {
    return buildCisoRiskTrendData(riskTrendPayloadByPeriod, language);
  }, [riskTrendPayloadByPeriod, language]);

  const rowsCountForState = useMemo(() => {
    return Math.max(rows.length, assetsTableRows.length);
  }, [rows.length, assetsTableRows.length]);

  const previewData = useMemo(() => {
    return buildPreviewAssetData(selectedRow, language);
  }, [selectedRow, language]);

  const stateText = useMemo(() => {
    return getCisoDashboardStateText({
      loading,
      error,
      rowsCount: rowsCountForState,
      language,
    });
  }, [loading, error, rowsCountForState, language]);

  return (
    <div className="dashboard-page dashboard-ciso-page">
      <div className="dashboard-content width-constrained">
        {(loading || error || rowsCountForState === 0) && (
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
  );
}
