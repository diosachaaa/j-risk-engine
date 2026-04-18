import { useEffect, useMemo, useState } from 'react';

import {
  getDashboardRiskTrend,
  getDashboardSummary,
  mapDashboardRiskTrendToView,
  mapDashboardSummaryToView,
} from '../../shared/data/dashboardApi';
import {
  buildDistribution,
  buildManagementInsightsData,
} from '../../shared/data/dashboardSelectors';
import { getManagementDashboardStateText } from '../data/managementDashboardData';
import ManagementMetricStrip from '../components/ManagementMetricStrip';
import ManagementDistributionCard from '../components/ManagementDistributionCard';
import ManagementTrendCard from '../components/ManagementTrendCard';
import ManagementInsightCard from '../components/ManagementInsightCard';
import { useLanguage } from '../../../../shared/contexts/useLanguage';

export default function ManagementDashboardPage() {
  const { language = 'id' } = useLanguage();

  const [summary, setSummary] = useState({
    total: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
    averageScore: 0,
  });
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');

        const [summaryResponse, trendResponse] = await Promise.all([
          getDashboardSummary(),
          getDashboardRiskTrend('weekly'),
        ]);

        const mappedSummary = mapDashboardSummaryToView(summaryResponse);
        const mappedTrendData = mapDashboardRiskTrendToView(trendResponse, {
          locale: language,
          period: 'weekly',
        });

        if (!isMounted) return;

        setSummary(mappedSummary);
        setTrendData(mappedTrendData);
      } catch (requestError) {
        if (!isMounted) return;

        setError(
          requestError?.message ||
            (language === 'en'
              ? 'Failed to load management dashboard data.'
              : 'Gagal memuat data dashboard management.'),
        );
        setSummary({
          total: 0,
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
          averageScore: 0,
        });
        setTrendData([]);
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

  const distribution = useMemo(() => {
    return buildDistribution(summary);
  }, [summary]);

  const insightData = useMemo(() => {
    return buildManagementInsightsData([], trendData, {
      locale: language,
      summaryOverride: summary,
    });
  }, [summary, trendData, language]);

  const hasDashboardData = useMemo(() => {
    return (summary.total ?? 0) > 0 || trendData.length > 0;
  }, [summary.total, trendData]);

  const stateText = useMemo(() => {
    return getManagementDashboardStateText({
      loading,
      error,
      rowsCount: hasDashboardData ? 1 : 0,
      language,
    });
  }, [loading, error, hasDashboardData, language]);

  return (
    <div className="dashboard-page dashboard-management-page">
      <div className="dashboard-content width-constrained">
        {(loading || error || !hasDashboardData) && (
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
  );
}
