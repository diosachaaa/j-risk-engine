import apiClient, {
  buildApiPath,
  unwrapResponseData,
} from '../../../../shared/api/apiClient';
import { mapDashboardRow } from './dashboardMappers';

function normalizeAssetId(assetId) {
  if (
    assetId === undefined ||
    assetId === null ||
    String(assetId).trim() === ''
  ) {
    throw new Error('assetId wajib diisi.');
  }

  return encodeURIComponent(String(assetId).trim());
}

function normalizeLocale(locale = 'id') {
  return locale === 'en' ? 'en' : 'id';
}

function pickFirst(source, paths = [], fallback = null) {
  for (const path of paths) {
    const value = String(path)
      .split('.')
      .reduce((acc, key) => {
        if (acc === undefined || acc === null) return undefined;
        return acc[key];
      }, source);

    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return fallback;
}

function toNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toRiskTone(value) {
  if (value >= 90) return 'red';
  if (value >= 70) return 'red';
  if (value >= 40) return 'yellow';
  return 'green';
}

function extractCollection(payload, preferredKeys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const keys = [
    ...preferredKeys,
    'items',
    'data',
    'results',
    'rows',
    'assets',
    'alerts',
    'points',
  ];

  for (const key of keys) {
    if (Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  return [];
}

function toLabel(value, fallback = '-') {
  if (!value) return fallback;

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  }

  return String(value);
}

function mapSeverityLabel(severityValue, locale = 'id') {
  const normalizedLocale = normalizeLocale(locale);
  const normalized = String(severityValue ?? '').toLowerCase();

  if (normalized.includes('critical') || normalized.includes('kritis')) {
    return normalizedLocale === 'en' ? 'Critical' : 'Kritis';
  }

  if (normalized.includes('high') || normalized.includes('tinggi')) {
    return normalizedLocale === 'en' ? 'High' : 'Tinggi';
  }

  if (normalized.includes('medium') || normalized.includes('sedang')) {
    return normalizedLocale === 'en' ? 'Medium' : 'Sedang';
  }

  if (normalized.includes('low') || normalized.includes('rendah')) {
    return normalizedLocale === 'en' ? 'Low' : 'Rendah';
  }

  const levelNumber = toNumber(severityValue, 0);
  if (levelNumber >= 12)
    return normalizedLocale === 'en' ? 'Critical' : 'Kritis';
  if (levelNumber >= 9) return normalizedLocale === 'en' ? 'High' : 'Tinggi';
  if (levelNumber >= 5) return normalizedLocale === 'en' ? 'Medium' : 'Sedang';
  if (levelNumber > 0) return normalizedLocale === 'en' ? 'Low' : 'Rendah';

  return normalizedLocale === 'en' ? 'Medium' : 'Sedang';
}

export function mapDashboardSummaryToView(payload = {}) {
  const data = pickFirst(payload, ['data'], payload) || {};

  const total = toNumber(
    pickFirst(
      data,
      ['total_assets', 'total', 'asset_total', 'summary.total_assets'],
      0,
    ),
    0,
  );

  const distribution =
    pickFirst(data, ['risk_distribution', 'distribution'], {}) || {};

  let low = 0;
  let medium = 0;
  let high = 0;
  let critical = 0;

  if (Array.isArray(distribution)) {
    distribution.forEach((item) => {
      const level = String(item?.level ?? item?.risk_level ?? '').toLowerCase();
      const count = toNumber(item?.count ?? item?.value ?? 0, 0);
      if (level === 'low') low += count;
      if (level === 'medium') medium += count;
      if (level === 'high') high += count;
      if (level === 'critical') critical += count;
    });
  } else {
    low = toNumber(pickFirst(distribution, ['low', 'rendah'], 0), 0);
    medium = toNumber(pickFirst(distribution, ['medium', 'sedang'], 0), 0);
    high = toNumber(pickFirst(distribution, ['high', 'tinggi'], 0), 0);
    critical = toNumber(pickFirst(distribution, ['critical', 'kritis'], 0), 0);
  }

  const averageScore = toNumber(
    pickFirst(
      data,
      ['avg_risk_score', 'average_risk_score', 'average_score'],
      0,
    ),
    0,
  );

  return {
    total,
    low,
    medium,
    high,
    critical,
    averageScore: Math.round(averageScore),
    lastUpdated: pickFirst(
      data,
      ['generated_at', 'last_updated', 'meta.generated_at'],
      '-',
    ),
  };
}

export function mapDashboardRiskTrendToView(payload = {}, options = {}) {
  const points = extractCollection(pickFirst(payload, ['data'], payload), [
    'points',
    'trend_data',
  ]);

  return points.map((point, index) => {
    const value = clamp(
      Math.round(
        toNumber(
          pickFirst(
            point,
            ['avg_risk_score', 'risk_score', 'value', 'score'],
            0,
          ),
          0,
        ),
      ),
      0,
      100,
    );

    const rawLabel = pickFirst(
      point,
      ['label', 'period_label', 'date', 'timestamp'],
      null,
    );

    return {
      id: point?.id || `trend-${index}`,
      label: toLabel(rawLabel, `P${index + 1}`),
      value,
      tone: toRiskTone(value),
      dateKey: String(rawLabel || index),
      period: options.period || null,
    };
  });
}

export function mapDashboardLatestAlertsToView(payload = {}, options = {}) {
  const locale = normalizeLocale(options.locale);
  const alerts = extractCollection(pickFirst(payload, ['data'], payload), [
    'alerts',
    'items',
  ]);

  return alerts.map((alert, index) => {
    const severity = mapSeverityLabel(
      pickFirst(alert, ['severity', 'risk_level', 'rule_level'], ''),
      locale,
    );

    const tone =
      severity === 'Critical' ||
      severity === 'Kritis' ||
      severity === 'High' ||
      severity === 'Tinggi'
        ? 'red'
        : severity === 'Medium' || severity === 'Sedang'
          ? 'yellow'
          : 'green';

    return {
      id: alert?.id || alert?.alert_id || `alert-${index}`,
      title: pickFirst(
        alert,
        ['activity_detail', 'title', 'description', 'message', 'rule_name'],
        '-',
      ),
      severity,
      time: toLabel(
        pickFirst(alert, ['event_time', 'timestamp', 'created_at'], '-'),
        '-',
      ),
      tone,
    };
  });
}

export function mapDashboardAssetsTableToRows(payload = {}, options = {}) {
  const locale = normalizeLocale(options.locale);
  const rows = extractCollection(pickFirst(payload, ['data'], payload), [
    'items',
    'assets',
    'rows',
  ]);

  return rows.map((row, index) => {
    const mapped = mapDashboardRow(row, row, { locale });

    return {
      ...mapped,
      id: mapped.id || row?.asset_id || `asset-row-${index}`,
    };
  });
}

export async function getDashboardSummary(config = {}) {
  const response = await apiClient.get(
    buildApiPath('/dashboard/summary'),
    config,
  );
  return unwrapResponseData(response);
}

export async function getDashboardRiskTrend(period = 'daily', config = {}) {
  const response = await apiClient.get(buildApiPath('/dashboard/risk-trend'), {
    ...config,
    params: {
      period,
      ...(config.params || {}),
    },
  });

  return unwrapResponseData(response);
}

export async function getDashboardLatestAlerts(limit = 5, config = {}) {
  const response = await apiClient.get(
    buildApiPath('/dashboard/latest-alerts'),
    {
      ...config,
      params: {
        limit,
        ...(config.params || {}),
      },
    },
  );

  return unwrapResponseData(response);
}

export async function getDashboardAssetsTable(options = {}, config = {}) {
  const {
    page = 1,
    pageSize = 50,
    sortBy = 'risk_score',
    order = 'desc',
    riskLevel,
  } = options;

  const response = await apiClient.get(
    buildApiPath('/dashboard/assets-table'),
    {
      ...config,
      params: {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        order,
        ...(riskLevel ? { risk_level: riskLevel } : {}),
        ...(config.params || {}),
      },
    },
  );

  return unwrapResponseData(response);
}

export async function getAssets(config = {}) {
  const response = await apiClient.get(buildApiPath('/assets'), {
    params: {
      limit: 200,
      ...(config.params || {}),
    },
    ...config,
  });

  return unwrapResponseData(response);
}

export async function getLatestScores(config = {}) {
  const response = await apiClient.get(buildApiPath('/scores/latest'), config);

  return unwrapResponseData(response);
}

export async function getAssetById(assetId, config = {}) {
  const normalizedAssetId = normalizeAssetId(assetId);

  const response = await apiClient.get(
    buildApiPath(`/assets/${normalizedAssetId}`),
    config,
  );

  return unwrapResponseData(response);
}

const dashboardApi = {
  getDashboardSummary,
  getDashboardRiskTrend,
  getDashboardLatestAlerts,
  getDashboardAssetsTable,
  mapDashboardSummaryToView,
  mapDashboardRiskTrendToView,
  mapDashboardLatestAlertsToView,
  mapDashboardAssetsTableToRows,
  getAssets,
  getLatestScores,
  getAssetById,
};

export default dashboardApi;
