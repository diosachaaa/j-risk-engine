const DEFAULT_LOCALE = 'id'

const STATUS_LABELS = {
  id: {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    critical: 'Kritis',
  },
  en: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  },
}

const RISK_LABELS = {
  id: {
    low: 'RISIKO RENDAH',
    medium: 'RISIKO SEDANG',
    high: 'RISIKO TINGGI',
    critical: 'RISIKO KRITIS',
  },
  en: {
    low: 'LOW RISK',
    medium: 'MEDIUM RISK',
    high: 'HIGH RISK',
    critical: 'CRITICAL RISK',
  },
}

const ASSET_STATUS_LABELS = {
  id: {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    maintenance: 'Maintenance',
    unknown: 'Tidak Diketahui',
  },
  en: {
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Maintenance',
    unknown: 'Unknown',
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

function hasValue(value) {
  return value !== undefined && value !== null && value !== ''
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

function normalizeAssetStatus(value) {
  const normalized = normalizeString(value, 'unknown').toLowerCase()

  if (
    [
      'active',
      'up',
      'online',
      'healthy',
      'running',
      'enabled',
      'ready',
    ].includes(normalized)
  ) {
    return 'active'
  }

  if (
    [
      'inactive',
      'down',
      'offline',
      'disabled',
      'stopped',
      'terminated',
    ].includes(normalized)
  ) {
    return 'inactive'
  }

  if (['maintenance', 'maint', 'updating'].includes(normalized)) {
    return 'maintenance'
  }

  return normalized || 'unknown'
}

function normalizeImpactScoreToRiskScore(value) {
  const numericValue = toNumber(value, Number.NaN)

  if (!Number.isFinite(numericValue)) {
    return null
  }

  const normalizedValue =
    numericValue >= 0 && numericValue <= 1 ? numericValue * 100 : numericValue

  return clampRiskScore(normalizedValue)
}

export function formatDateTime(value, locale = DEFAULT_LOCALE) {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return normalizeString(value, '-')
  }

  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
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

    if (['unknown', 'n/a', '-'].includes(normalized)) {
      return 'unknown'
    }

    if (['critical', 'kritikal', 'kritis', 'severe'].includes(normalized)) {
      return 'critical'
    }

    if (['high', 'tinggi'].includes(normalized)) {
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

  if (numericValue >= 90) return 'critical'
  if (numericValue >= 70) return 'high'
  if (numericValue >= 40) return 'medium'
  return 'low'
}

export function getRiskStatusLabel(level, locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale)
  const normalizedLevel = getRiskLevel(level)

  if (normalizedLevel === 'unknown') {
    return normalizedLocale === 'en' ? 'Unknown' : 'Tidak Diketahui'
  }

  return STATUS_LABELS[normalizedLocale][normalizedLevel]
}

export function getRiskLabel(level, locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale)
  const normalizedLevel = getRiskLevel(level)

  if (normalizedLevel === 'unknown') {
    return normalizedLocale === 'en' ? 'UNKNOWN RISK' : 'RISIKO TIDAK DIKETAHUI'
  }

  return RISK_LABELS[normalizedLocale][normalizedLevel]
}

export function getAssetStatusLabel(status, locale = DEFAULT_LOCALE) {
  const normalizedLocale = normalizeLocale(locale)
  const normalizedStatus = normalizeAssetStatus(status)

  return (
    ASSET_STATUS_LABELS[normalizedLocale][normalizedStatus] ||
    toTitleCase(normalizedStatus, ASSET_STATUS_LABELS[normalizedLocale].unknown)
  )
}

export function mapRiskComponents(raw = {}) {
  const source =
    pickFirst(
      raw,
      [
        'risk_components',
        'riskComponents',
        'components',
        'breakdown',
        'score_breakdown',
        'scoreBreakdown',
      ],
      null,
    ) ?? raw

  const impact = clampRiskScore(
    pickFirst(
      source,
      ['impact', 'impact_score', 'impactScore', 'score_i', 'criticality', 'criticality_score', 'criticalityScore'],
      0,
    ),
  )

  const vulnerability = clampRiskScore(
    pickFirst(
      source,
      ['vulnerability', 'vuln', 'vuln_score', 'vulnerabilityScore', 'score_v'],
      0,
    ),
  )

  const threat = clampRiskScore(
    pickFirst(source, ['threat', 'threat_score', 'threatScore', 'score_t'], 0),
  )

  const w1 = toNumber(
    pickFirst(source, ['w1', 'weight_vulnerability', 'weightVulnerability'], 0.3),
    0.3,
  )

  const w2 = toNumber(
    pickFirst(source, ['w2', 'weight_threat', 'weightThreat'], 0.7),
    0.7,
  )

  return {
    impact,
    vulnerability,
    threat,
    criticality: impact,
    w1,
    w2,
    formula: normalizeString(
      pickFirst(source, ['formula', 'risk_formula', 'riskFormula'], ''),
      '',
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
      [
        'asset_type',
        'assetType',
        'type',
        'category',
        'platform',
        'os_type',
        'os_name',
        'os',
      ],
      TYPE_FALLBACK[locale],
    ),
    TYPE_FALLBACK[locale],
  )

  const normalizedAssetStatus = normalizeAssetStatus(
    pickFirst(raw, ['status', 'state', 'asset_status'], 'unknown'),
  )

  const impactScoreRaw = pickFirst(
    raw,
    ['impact_score', 'impactScore', 'impact', 'weight'],
    null,
  )

  const updatedAtRaw = pickFirst(
    raw,
    [
      'updated_at',
      'updatedAt',
      'last_updated',
      'lastUpdated',
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
    status: normalizedAssetStatus,
    statusLabel: getAssetStatusLabel(normalizedAssetStatus, locale),
    impactScore: hasValue(impactScoreRaw) ? toNumber(impactScoreRaw, 0) : null,
    impactScoreAsRiskScore: normalizeImpactScoreToRiskScore(impactScoreRaw),
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

  const rawScoreValue = pickFirst(
    raw,
    ['risk_score', 'riskScore', 'score', 'value', 'score_r'],
    undefined,
  )

  const hasScoreValue = hasValue(rawScoreValue)
  const score = clampRiskScore(hasScoreValue ? rawScoreValue : 0)

  const rawLevel = pickFirst(
    raw,
    [
      'severity',
      'risk_level',
      'riskLevel',
      'risk_status',
      'riskStatus',
      'level',
      'status',
    ],
    undefined,
  )

  const level = getRiskLevel(hasValue(rawLevel) ? rawLevel : score)

  const updatedAtRaw = pickFirst(
    raw,
    [
      'timestamp',
      'updated_at',
      'updatedAt',
      'last_updated',
      'lastUpdated',
      'calculated_at',
      'calculatedAt',
    ],
    null,
  )

  return {
    id: assetId || buildFallbackId('score', score),
    assetId: assetId || buildFallbackId('asset', score),
    score,
    hasScoreValue,
    level,
    status: getRiskStatusLabel(level, locale),
    riskStatus: getRiskStatusLabel(level, locale),
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
    assetInput?.assetId || assetInput?.name
      ? assetInput
      : mapAsset(assetInput, { locale })

  const score =
    scoreInput?.score !== undefined || scoreInput?.riskComponents
      ? {
        ...scoreInput,
        hasScoreValue:
          scoreInput?.hasScoreValue ?? scoreInput?.score !== undefined,
      }
      : mapLatestScore(scoreInput, { locale })

  const assetId =
    asset.assetId ||
    score.assetId ||
    asset.id ||
    score.id ||
    buildFallbackId('asset', asset.name || score.score)

  const fallbackImpactScore = asset.impactScoreAsRiskScore
  const resolvedScore = score.hasScoreValue
    ? clampRiskScore(score.score)
    : clampRiskScore(fallbackImpactScore ?? 0)

  const level = getRiskLevel(score.level || score.status || resolvedScore)
  const riskStatus = getRiskStatusLabel(level, locale)
  const assetStatus = asset.status || 'unknown'

  return {
    id: asset.id || score.id || assetId,
    assetId,
    name: asset.name || asset.hostname || assetId,
    type: asset.type || TYPE_FALLBACK[locale],
    score: resolvedScore,
    scoreSource: score.hasScoreValue
      ? 'latest_score'
      : fallbackImpactScore !== null && fallbackImpactScore !== undefined
        ? 'impact_score'
        : 'default',
    level,
    status: riskStatus,
    riskStatus,
    riskLabel: getRiskLabel(level, locale),
    updatedAt:
      score.updatedAt && score.updatedAt !== '-'
        ? score.updatedAt
        : asset.updatedAt || '-',
    updatedAtRaw: score.updatedAtRaw || asset.updatedAtRaw || null,
    hostname: asset.hostname || asset.name || assetId,
    ipAddress: asset.ipAddress || '-',
    assetStatus,
    assetStatusLabel:
      asset.statusLabel || getAssetStatusLabel(assetStatus, locale),
    impactScore: asset.impactScore,
    environment: asset.environment || '-',
    criticality: asset.criticality || '-',
    riskComponents: score.riskComponents || mapRiskComponents({}),
    vulnerabilities: [
      ...new Set([
        ...(asset.vulnerabilities || []),
        ...(score.vulnerabilities || []),
      ]),
    ],
    securityAlerts: [
      ...new Set([
        ...(asset.securityAlerts || []),
        ...(score.securityAlerts || []),
      ]),
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

export function mapAssetsTablePayload(payload, options = {}) {
  const locale = normalizeLocale(options.locale)

  return extractCollection(payload, ['data', 'items', 'rows', 'assets']).map(
    (item) => {
      const mappedRow = mapDashboardRow(item, item, { locale })

      if (mappedRow.level !== 'unknown') {
        return mappedRow
      }

      return {
        ...mappedRow,
        scoreSource: 'no_score',
      }
    },
  )
}