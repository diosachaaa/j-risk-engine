function normalizeLanguage(language = 'id') {
  return language === 'en' ? 'en' : 'id';
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

function clampRiskScore(value) {
  return clamp(Math.round(toNumber(value, 0)), 0, 100);
}

function formatShortLabel(dateValue, language = 'id') {
  const locale = normalizeLanguage(language);

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
    weekday: 'short',
  }).format(date);
}

function formatTrendLabel(dateValue, period = 'weekly', language = 'id', fallback = '-') {
  const locale = normalizeLanguage(language);

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  if (period === 'yearly') {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
      month: 'short',
    }).format(date);
  }

  if (period === 'monthly') {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  }

  return formatShortLabel(date, language);
}

function getTrendSource(payload = {}) {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const source = payload.data;

  if (source && typeof source === 'object' && !Array.isArray(source)) {
    return source;
  }

  return payload;
}

function getToneByValue(value) {
  if (value >= 75) return 'red';
  if (value >= 40) return 'yellow';
  return 'green';
}

function buildGroupedTrend(rows = [], language = 'id') {
  const groups = rows.reduce((result, row) => {
    const rawDate = row?.updatedAtRaw;

    if (!rawDate) return result;

    const date = new Date(rawDate);

    if (Number.isNaN(date.getTime())) return result;

    const key = date.toISOString().slice(0, 10);

    if (!result[key]) {
      result[key] = {
        key,
        date,
        values: [],
      };
    }

    result[key].values.push(clampRiskScore(row?.score));

    return result;
  }, {});

  return Object.values(groups)
    .sort((left, right) => left.date.getTime() - right.date.getTime())
    .slice(-7)
    .map((group) => {
      const total = group.values.reduce((sum, value) => sum + value, 0);
      const average =
        group.values.length > 0 ? Math.round(total / group.values.length) : 0;

      return {
        id: `management-trend-${group.key}`,
        label: formatShortLabel(group.date, language),
        value: average,
        tone: getToneByValue(average),
        dateKey: group.key,
      };
    });
}

export function buildManagementRiskTrendData(rows = [], language = 'id') {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  return buildGroupedTrend(rows, language);
}

export function mapManagementRiskTrendPayload(payload = {}, language = 'id') {
  const source = getTrendSource(payload);

  const period =
    typeof source.period === 'string' && source.period.trim() !== ''
      ? source.period.trim().toLowerCase()
      : 'weekly';

  const points = Array.isArray(source.points) ? source.points : [];

  return points.map((point, index) => {
    const timestamp = point.timestamp ?? point.time ?? null;
    const value = clampRiskScore(point.average_risk ?? point.averageRisk);

    return {
      id: `management-trend-${timestamp || index}`,
      label: formatTrendLabel(timestamp, period, language, `P${index + 1}`),
      value,
      tone: getToneByValue(value),
      dateKey:
        typeof timestamp === 'string' && timestamp.length >= 10
          ? timestamp.slice(0, 10)
          : null,
    };
  });
}

export function getManagementDashboardStateText({
  loading = false,
  error = '',
  rowsCount = 0,
  language = 'id',
} = {}) {
  const locale = normalizeLanguage(language);

  if (loading) {
    return locale === 'en'
      ? 'Loading management dashboard data...'
      : 'Sedang memuat data dashboard management...';
  }

  if (error) {
    return error;
  }

  if (rowsCount === 0) {
    return locale === 'en'
      ? 'No management dashboard data is available yet.'
      : 'Belum ada data dashboard management yang tersedia.';
  }

  return '';
}
