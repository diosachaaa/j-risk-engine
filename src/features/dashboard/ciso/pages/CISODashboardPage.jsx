import { useEffect, useMemo, useState } from 'react';

import {
  buildCisoRecentAlerts,
  buildCisoRiskTrendData,
  buildPreviewAssetData,
  getCisoDashboardStateText,
} from '../data/dashboardData';
import {
  getDashboardAssetsTable,
  getDashboardLatestAlerts,
  getDashboardRiskTrend,
  getDashboardSummary,
  mapDashboardAssetsTableToRows,
  mapDashboardLatestAlertsToView,
  mapDashboardRiskTrendToView,
  mapDashboardSummaryToView,
} from '../../shared/data/dashboardApi';
import {
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
  const [summary, setSummary] = useState({
    total: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
    averageScore: 0,
  });
  const [rows, setRows] = useState([]);
  const [riskTrendData, setRiskTrendData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');

        const [
          summaryResponse,
          trendDailyResponse,
          trendWeeklyResponse,
          trendMonthlyResponse,
          trendYearlyResponse,
          latestAlertsResponse,
          assetsTableResponse,
        ] = await Promise.all([
          getDashboardSummary(),
          getDashboardRiskTrend('daily'),
          getDashboardRiskTrend('weekly'),
          getDashboardRiskTrend('monthly'),
          getDashboardRiskTrend('yearly'),
          getDashboardLatestAlerts(5),
          getDashboardAssetsTable({
            page: 1,
            pageSize: 100,
            sortBy: 'risk_score',
            order: 'desc',
          }),
        ]);

        const mappedSummary = mapDashboardSummaryToView(summaryResponse);
        const mappedRows = mapDashboardAssetsTableToRows(assetsTableResponse, {
          locale: language,
        });
        const mappedRecentAlerts = mapDashboardLatestAlertsToView(
          latestAlertsResponse,
          { locale: language },
        );
        const mappedRiskTrendData = {
          daily: mapDashboardRiskTrendToView(trendDailyResponse, {
            locale: language,
            period: 'daily',
          }),
          weekly: mapDashboardRiskTrendToView(trendWeeklyResponse, {
            locale: language,
            period: 'weekly',
          }),
          monthly: mapDashboardRiskTrendToView(trendMonthlyResponse, {
            locale: language,
            period: 'monthly',
          }),
          yearly: mapDashboardRiskTrendToView(trendYearlyResponse, {
            locale: language,
            period: 'yearly',
          }),
        };

        const mergedRows =
          mappedRows.length > 0
            ? mappedRows
            : mergeAssetsWithScores([], [], { locale: language });

        if (!isMounted) return;

        setSummary(mappedSummary);
        setRiskTrendData(mappedRiskTrendData);
        setRecentAlerts(mappedRecentAlerts);
        setRows(mergedRows);
      } catch (requestError) {
        if (!isMounted) return;

        setError(
          requestError?.message ||
            (language === 'en'
              ? 'Failed to load dashboard data.'
              : 'Gagal memuat data dashboard.'),
        );
        setSummary({
          total: 0,
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
          averageScore: 0,
        });
        setRiskTrendData({ daily: [], weekly: [], monthly: [], yearly: [] });
        setRecentAlerts([]);
        setRows([]);
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

  const securityStatusItems = useMemo(() => {
    return buildSecurityStatusItems(summary, language);
  }, [summary, language]);

  const topRiskRows = useMemo(() => {
    return buildTopRiskRows(rows, 10);
  }, [rows]);

  const technicalAnalysisPoints = useMemo(() => {
    return buildTechnicalAnalysisPoints(rows, language);
  }, [rows, language]);

  const derivedRecentAlerts = useMemo(() => {
    if (recentAlerts.length > 0) {
      return recentAlerts;
    }

    return buildCisoRecentAlerts(rows, language);
  }, [recentAlerts, rows, language]);

  const derivedRiskTrendData = useMemo(() => {
    const hasTrendData = Object.values(riskTrendData).some(
      (items) => Array.isArray(items) && items.length > 0,
    );

    if (hasTrendData) {
      return riskTrendData;
    }

    return buildCisoRiskTrendData(rows);
  }, [riskTrendData, rows]);

  const previewData = useMemo(() => {
    return buildPreviewAssetData(selectedRow, language);
  }, [selectedRow, language]);

  const hasDashboardData = useMemo(() => {
    return (
      (summary.total ?? 0) > 0 ||
      rows.length > 0 ||
      Object.values(derivedRiskTrendData).some((items) =>
        Array.isArray(items) ? items.length > 0 : false,
      )
    );
  }, [summary.total, rows.length, derivedRiskTrendData]);

  const stateText = useMemo(() => {
    return getCisoDashboardStateText({
      loading,
      error,
      rowsCount: hasDashboardData ? 1 : 0,
      language,
    });
  }, [loading, error, hasDashboardData, language]);

  return (
    <div className="dashboard-page dashboard-ciso-page">
      <div className="dashboard-content width-constrained">
        {(loading || error || !hasDashboardData) && (
          <section className="dashboard-panel dashboard-state-panel">
            <p>{stateText}</p>
          </section>
        )}

        <MetricStrip summary={summary} />
        <RiskTrendCard data={derivedRiskTrendData} />

        <div className="dashboard-two-column-grid">
          <SecurityStatusCard items={securityStatusItems} />
          <RecentAlertCard alerts={derivedRecentAlerts} />
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
