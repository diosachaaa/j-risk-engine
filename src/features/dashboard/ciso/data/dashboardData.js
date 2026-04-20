import { getRiskLabel } from '../../shared/data/dashboardMappers'

function normalizeLanguage(language = 'id') {
  return language === 'en' ? 'en' : 'id'
}

function toNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '')
    const parsed = Number(normalized)

    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function clampRiskScore(value) {
  return clamp(Math.round(toNumber(value, 0)), 0, 100)
}

function mapToneFromLevel(level = 'medium') {
  if (level === 'critical') return 'red'
  if (level === 'high') return 'red'
  if (level === 'low') return 'green'
  return 'yellow'
}

function mapSeverityLabel(level = 'medium', language = 'id') {
  const locale = normalizeLanguage(language)

  if (locale === 'en') {
    if (level === 'critical') return 'Critical'
    if (level === 'high') return 'High'
    if (level === 'low') return 'Low'
    return 'Medium'
  }

  if (level === 'critical') return 'Kritis'
  if (level === 'high') return 'Tinggi'
  if (level === 'low') return 'Rendah'
  return 'Sedang'
}

function buildEmptyTrendPeriod() {
  return []
}

function getTrendSource(payload = {}) {
  if (!payload || typeof payload !== 'object') {
    return {}
  }

  const source = payload.data

  if (source && typeof source === 'object' && !Array.isArray(source)) {
    return source
  }

  return payload
}

function formatTrendLabel(timestamp, period = 'daily', language = 'id', fallback = '-') {
  if (!timestamp) return fallback

  const locale = normalizeLanguage(language)
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  if (period === 'yearly') {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
      month: 'short',
    }).format(date)
  }

  if (period === 'monthly') {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
      day: '2-digit',
      month: 'short',
    }).format(date)
  }

  if (period === 'weekly') {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
      weekday: 'short',
    }).format(date)
  }

  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function mapTrendTone(point = {}) {
  const criticalCount = toNumber(point.critical_count ?? point.criticalCount, 0)
  const highCount = toNumber(point.high_count ?? point.highCount, 0)
  const mediumCount = toNumber(point.medium_count ?? point.mediumCount, 0)

  if (criticalCount > 0) return 'critical'
  if (highCount > 0) return 'high'
  if (mediumCount > 0) return 'medium'
  return 'low'
}

function mapTrendPeriod(payload = {}, fallbackPeriod = 'daily', language = 'id') {
  const source = getTrendSource(payload)
  const period =
    typeof source.period === 'string' && source.period.trim() !== ''
      ? source.period.trim().toLowerCase()
      : fallbackPeriod

  const points = Array.isArray(source.points) ? source.points : []

  return points.map((point, index) => {
    const timestamp = point.timestamp ?? point.time ?? null

    return {
      id: `trend-${period}-${timestamp || index}`,
      label: formatTrendLabel(timestamp, period, language, `P${index + 1}`),
      value: clampRiskScore(point.average_risk ?? point.averageRisk),
      tone: mapTrendTone(point),
      timestamp,
    }
  })
}

export function buildCisoRiskTrendData(trendPayloadByPeriod = {}, language = 'id') {
  if (
    !trendPayloadByPeriod ||
    typeof trendPayloadByPeriod !== 'object' ||
    Array.isArray(trendPayloadByPeriod)
  ) {
    return {
      daily: buildEmptyTrendPeriod(),
      weekly: buildEmptyTrendPeriod(),
      monthly: buildEmptyTrendPeriod(),
      yearly: buildEmptyTrendPeriod(),
    }
  }

  return {
    daily: mapTrendPeriod(trendPayloadByPeriod.daily, 'daily', language),
    weekly: mapTrendPeriod(trendPayloadByPeriod.weekly, 'weekly', language),
    monthly: mapTrendPeriod(trendPayloadByPeriod.monthly, 'monthly', language),
    yearly: mapTrendPeriod(trendPayloadByPeriod.yearly, 'yearly', language),
  }
}

export function buildCisoRecentAlerts(rows = [], language = 'id') {
  if (!Array.isArray(rows) || rows.length === 0) {
    return []
  }

  return rows
    .flatMap((row) => {
      const alerts = Array.isArray(row.securityAlerts) ? row.securityAlerts : []

      return alerts.map((alert, index) => ({
        id: `${row.assetId || row.id || row.name}-alert-${index}`,
        title: alert,
        severity: mapSeverityLabel(row.level, language),
        time: row.updatedAt || '-',
        tone: mapToneFromLevel(row.level),
      }))
    })
    .slice(0, 5)
}

export function buildPreviewAssetData(row, language = 'id') {
  if (!row) return null

  const locale = normalizeLanguage(language)

  const fallbackVulnerabilities =
    locale === 'en'
      ? ['No vulnerability details available yet']
      : ['Belum ada detail kerentanan yang tersedia']

  const fallbackAlerts =
    locale === 'en'
      ? ['No alert details available yet']
      : ['Belum ada detail alert yang tersedia']

  const fallbackActivities =
    locale === 'en'
      ? ['No activity log available yet']
      : ['Belum ada activity log yang tersedia']

  const vulnerabilities =
    Array.isArray(row.vulnerabilities) && row.vulnerabilities.length > 0
      ? row.vulnerabilities
      : fallbackVulnerabilities

  const securityAlerts =
    Array.isArray(row.securityAlerts) && row.securityAlerts.length > 0
      ? row.securityAlerts
      : fallbackAlerts

  const activities =
    Array.isArray(row.activities) && row.activities.length > 0
      ? row.activities
      : fallbackActivities

  return {
    id: row.assetId || row.id,
    score: row.score ?? 0,
    riskLabel: getRiskLabel(row.level || row.status || row.score, locale),
    assetName: row.name ?? '-',
    vulnerabilities,
    securityAlerts,
    activities,
    lastUpdated: row.updatedAt ?? '-',
  }
}

export function getCisoDashboardStateText({
  loading = false,
  error = '',
  rowsCount = 0,
  language = 'id',
} = {}) {
  const locale = normalizeLanguage(language)

  if (loading) {
    return locale === 'en'
      ? 'Loading dashboard data...'
      : 'Sedang memuat data dashboard...'
  }

  if (error) {
    return error
  }

  if (rowsCount === 0) {
    return locale === 'en'
      ? 'No dashboard data is available yet.'
      : 'Belum ada data dashboard yang tersedia.'
  }

  return ''
}