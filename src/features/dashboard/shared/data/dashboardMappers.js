const DEFAULT_LOCALE = 'id'

const STATUS_LABELS = {
  id: {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
  },
  en: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
}

const RISK_LABELS = {
  id: {
    low: 'RISIKO RENDAH',
    medium: 'RISIKO SEDANG',
    high: 'RISIKO TINGGI',
  },
  en: {
    low: 'LOW RISK',
    medium: 'MEDIUM RISK',
    high: 'HIGH RISK',
  },
}

const TYPE_FALLBACK = {
  id: 'Tipe Aset',
  en: 'Asset Type',
}

function normalizeLocale(locale = DEFAULT_LOCALE) {
  return locale === 'en' ? 'en' : 'id'
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function normalizeString(value, fallback = '') {
  if (value === undefined || value === null) return fallback

  const normalized = String(value).trim()

  return normalized === '' ? fallback : normalized
}

function getByPath(source, path) {
  if (!source || typeof source !== 'object') return undefined

  return String(path)
    .split('.')
    .reduce((current, key) => {
      if (current === undefined || current === null) return undefined
      return current[key]
    }, source)
}

function pickFirst(source, paths = [], fallback = null) {
  for (const path of paths) {
    const value = getByPath(source, path)

    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }

  return fallback
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

function toTitleCase(value, fallback = '-') {
  const normalized = normalizeString(value)

  if (!normalized) return fallback

  return normalized
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export function formatDateTime(value, locale = DEFAULT_LOCALE) {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return normalizeString(value, '-')
  }

  return new Intl.DateTimeFormat(
    locale === 'en' ? 'en-US' : 'id-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date)
}

export function buildAssetLookupKey(value) {
  return normalizeString(value).toLowerCase()
}

export function extractCollection(payload, preferredKeys = []) {
  if (Array.isArray(payload)) return payload

  if (!payload || typeof payload !== 'object') return []

  const candidateKeys = [
    ...preferredKeys,
    'items',
    'data',
    'results',
    'assets',
    'scores',
    'rows',
    'list',
  ]

  for (const key of candidateKeys) {
    const value = payload[key]

    if (Array.isArray(value)) {
      return value
    }
  }

  return []
}

function extractStringArray(value) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (isNonEmptyString(item)) return item.trim()

      if (item && typeof item === 'object') {
        return normalizeString(
          item.name ||
            item.title ||
            item.description ||
            item.id ||
            item.code ||
            item.cve,
        )
      }

      return ''
    })
    .filter(Boolean)
}

function mapAlertList(value) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (isNonEmptyString(item)) {
        return item.trim()
      }

      if (item && typeof item === 'object') {
        return normalizeString(
          item.description ||
            item.message ||
            item.title ||
            item.rule ||
            item.rule_name,
        )
      }

      return ''
    })
    .filter(Boolean)
}

export function getRiskLevel(value) {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (['high', 'tinggi', 'critical', 'kritikal'].includes(normalized)) {
      return 'high'
    }

    if (['medium', 'sedang', 'warning', 'moderate'].includes(normalized)) {
      return 'medium'
    }

    if (['low', 'rendah', 'secure', 'aman'].includes(normalized)) {
      return 'low'
    }
  }

  const numericValue = clampRiskScore(value)

  if (numericValue >= 75) return 'high'
  if (numericValue >= 40) return 'medium'
  return 'low'
}

export function getRiskStatusLabel(level, locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale)
  const normalizedLevel = getRiskLevel(level)

  return STATUS_LABELS[normalizedLocale][normalizedLevel]
}

export function getRiskLabel(level, locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale)
  const normalizedLevel = getRiskLevel(level)

  return RISK_LABELS[normalizedLocale][normalizedLevel]
}

export function mapRiskComponents(raw = {}) {
  const source =
    pickFirst(raw, ['risk_components', 'riskComponents', 'components'], null) ??
    raw

  return {
    threat: clampRiskScore(
      pickFirst(source, ['threat', 'threat_score', 'threatScore'], 0),
    ),
    vulnerability: clampRiskScore(
      pickFirst(
        source,
        ['vulnerability', 'vuln', 'vuln_score', 'vulnerabilityScore'],
        0,
      ),
    ),
    criticality: clampRiskScore(
      pickFirst(source, ['criticality', 'criticality_score', 'criticalityScore'], 0),
    ),
  }
}

function buildFallbackId(prefix, referenceValue) {
  const normalizedReference = normalizeString(referenceValue, 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${prefix}-${normalizedReference || 'unknown'}`
}

export function mapAsset(raw = {}, options = {}) {
  const locale = normalizeLocale(options.locale)

  const assetId = normalizeString(
    pickFirst(
      raw,
      [
        'asset_id',
        'assetId',
        'id',
        'hostname',
        'host_name',
        'agent_id',
        'agentId',
      ],
      '',
    ),
  )

  const name = normalizeString(
    pickFirst(
      raw,
      [
        'asset_name',
        'assetName',
        'name',
        'hostname',
        'host_name',
        'agent_name',
        'agentName',
      ],
      assetId,
    ),
    assetId || '-',
  )

  const type = normalizeString(
    pickFirst(
      raw,
      ['asset_type', 'assetType', 'type', 'category', 'platform', 'os_name'],
      TYPE_FALLBACK[locale],
    ),
    TYPE_FALLBACK[locale],
  )

  const updatedAtRaw = pickFirst(
    raw,
    [
      'updated_at',
      'updatedAt',
      'last_seen',
      'lastSeen',
      'timestamp',
      'created_at',
      'createdAt',
    ],
    null,
  )

  return {
    id: assetId || buildFallbackId('asset', name),
    assetId: assetId || buildFallbackId('asset', name),
    name,
    type: toTitleCase(type, TYPE_FALLBACK[locale]),
    hostname: normalizeString(
      pickFirst(raw, ['hostname', 'host_name', 'name'], name),
      name,
    ),
    ipAddress: normalizeString(
      pickFirst(raw, ['ip_address', 'ipAddress', 'ip', 'agent_ip'], '-'),
      '-',
    ),
    status: normalizeString(
      pickFirst(raw, ['status', 'state', 'asset_status'], 'Active'),
      'Active',
    ),
    environment: normalizeString(
      pickFirst(raw, ['environment', 'env'], '-'),
      '-',
    ),
    criticality: normalizeString(
      pickFirst(raw, ['criticality_label', 'criticality'], '-'),
      '-',
    ),
    updatedAt: formatDateTime(updatedAtRaw, locale),
    updatedAtRaw,
    vulnerabilities: extractStringArray(
      pickFirst(raw, ['vulnerabilities', 'vulns', 'cves'], []),
    ),
    securityAlerts: mapAlertList(
      pickFirst(raw, ['security_alerts', 'securityAlerts', 'alerts'], []),
    ),
    activities: extractStringArray(
      pickFirst(raw, ['activities', 'activity_logs', 'activityLogs'], []),
    ),
    raw,
  }
}

export function mapLatestScore(raw = {}, options = {}) {
  const locale = normalizeLocale(options.locale)

  const assetId = normalizeString(
    pickFirst(raw, ['asset_id', 'assetId', 'id', 'hostname'], ''),
  )

  const score = clampRiskScore(
    pickFirst(raw, ['risk_score', 'riskScore', 'score', 'value'], 0),
  )

  const level = getRiskLevel(
    pickFirst(raw, ['risk_level', 'riskLevel', 'level', 'status'], score),
  )

  const updatedAtRaw = pickFirst(
    raw,
    ['timestamp', 'updated_at', 'updatedAt', 'calculated_at', 'calculatedAt'],
    null,
  )

  return {
    id: assetId || buildFallbackId('score', score),
    assetId: assetId || buildFallbackId('asset', score),
    score,
    level,
    status: getRiskStatusLabel(level, locale),
    riskLabel: getRiskLabel(level, locale),
    updatedAt: formatDateTime(updatedAtRaw, locale),
    updatedAtRaw,
    riskComponents: mapRiskComponents(raw),
    vulnerabilities: extractStringArray(
      pickFirst(raw, ['vulnerabilities', 'vulns', 'cves'], []),
    ),
    securityAlerts: mapAlertList(
      pickFirst(raw, ['security_alerts', 'securityAlerts', 'alerts'], []),
    ),
    activities: extractStringArray(
      pickFirst(raw, ['activities', 'activity_logs', 'activityLogs'], []),
    ),
    raw,
  }
}

export function mapDashboardRow(assetInput = {}, scoreInput = {}, options = {}) {
  const locale = normalizeLocale(options.locale)

  const asset =
    assetInput?.assetId || assetInput?.name ? assetInput : mapAsset(assetInput, { locale })

  const score =
    scoreInput?.score !== undefined || scoreInput?.riskComponents
      ? scoreInput
      : mapLatestScore(scoreInput, { locale })

  const assetId =
    asset.assetId ||
    score.assetId ||
    asset.id ||
    score.id ||
    buildFallbackId('asset', asset.name || score.score)

  const level = getRiskLevel(score.level || score.status || score.score)

  return {
    id: asset.id || score.id || assetId,
    assetId,
    name: asset.name || asset.hostname || assetId,
    type: asset.type || TYPE_FALLBACK[locale],
    score: clampRiskScore(score.score),
    level,
    status: getRiskStatusLabel(level, locale),
    riskLabel: getRiskLabel(level, locale),
    updatedAt:
      score.updatedAt && score.updatedAt !== '-'
        ? score.updatedAt
        : asset.updatedAt || '-',
    updatedAtRaw: score.updatedAtRaw || asset.updatedAtRaw || null,
    hostname: asset.hostname || asset.name || assetId,
    ipAddress: asset.ipAddress || '-',
    assetStatus: asset.status || 'Active',
    environment: asset.environment || '-',
    criticality: asset.criticality || '-',
    riskComponents: score.riskComponents || mapRiskComponents({}),
    vulnerabilities: [
      ...new Set([...(asset.vulnerabilities || []), ...(score.vulnerabilities || [])]),
    ],
    securityAlerts: [
      ...new Set([...(asset.securityAlerts || []), ...(score.securityAlerts || [])]),
    ],
    activities: [
      ...new Set([...(asset.activities || []), ...(score.activities || [])]),
    ],
    raw: {
      asset: asset.raw || assetInput,
      score: score.raw || scoreInput,
    },
  }
}

export function mapAssetsPayload(payload, options = {}) {
  return extractCollection(payload, ['assets', 'items', 'data']).map((item) =>
    mapAsset(item, options),
  )
}

export function mapLatestScoresPayload(payload, options = {}) {
  return extractCollection(payload, ['scores', 'items', 'data']).map((item) =>
    mapLatestScore(item, options),
  )
}