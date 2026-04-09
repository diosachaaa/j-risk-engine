import { getRiskLabel } from '../../shared/data/dashboardMappers'

function normalizeLanguage(language = 'id') {
  return language === 'en' ? 'en' : 'id'
}

function mapToneFromLevel(level = 'medium') {
  if (level === 'high') return 'red'
  if (level === 'low') return 'green'
  return 'yellow'
}

function mapSeverityLabel(level = 'medium', language = 'id') {
  const locale = normalizeLanguage(language)

  if (locale === 'en') {
    if (level === 'high') return 'High'
    if (level === 'low') return 'Low'
    return 'Medium'
  }

  if (level === 'high') return 'Tinggi'
  if (level === 'low') return 'Rendah'
  return 'Sedang'
}

function buildEmptyTrendPeriod() {
  return []
}

export function buildCisoRiskTrendData(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      daily: buildEmptyTrendPeriod(),
      weekly: buildEmptyTrendPeriod(),
      monthly: buildEmptyTrendPeriod(),
      yearly: buildEmptyTrendPeriod(),
    }
  }

  return {
    daily: buildEmptyTrendPeriod(),
    weekly: buildEmptyTrendPeriod(),
    monthly: buildEmptyTrendPeriod(),
    yearly: buildEmptyTrendPeriod(),
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