const DEFAULT_LOCALE = 'id'

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

function formatDateTime(value, locale = DEFAULT_LOCALE) {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return normalizeString(value, '-')
  }

  return new Intl.DateTimeFormat(
    locale === 'en' ? 'en-US' : 'id-ID',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date)
}

function formatDateOnly(value, locale = DEFAULT_LOCALE) {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return normalizeString(value, '-')
  }

  return new Intl.DateTimeFormat(
    locale === 'en' ? 'en-US' : 'id-ID',
    {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date)
}

function extractCollection(payload, preferredKeys = []) {
  if (Array.isArray(payload)) return payload

  if (!payload || typeof payload !== 'object') return []

  const candidateKeys = [
    ...preferredKeys,
    'items',
    'data',
    'results',
    'trends',
    'history',
    'rows',
    'list',
  ]

  for (const key of candidateKeys) {
    const value = payload[key]

    if (Array.isArray(value)) return value
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

function mapSecurityAlerts(value, locale = DEFAULT_LOCALE) {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (isNonEmptyString(item)) {
        return {
          severity: locale === 'en' ? 'Medium' : 'Sedang',
          description: item.trim(),
          time: '-',
        }
      }

      if (item && typeof item === 'object') {
        return {
          severity: toTitleCase(
            pickFirst(item, ['severity', 'level', 'status'], locale === 'en' ? 'Medium' : 'Sedang'),
            locale === 'en' ? 'Medium' : 'Sedang',
          ),
          description: normalizeString(
            pickFirst(item, ['description', 'message', 'title', 'rule_name', 'rule']),
            'Alert Description',
          ),
          time: normalizeString(
            pickFirst(item, ['time', 'timestamp', 'created_at', 'updated_at']),
            '-',
          ),
        }
      }

      return null
    })
    .filter(Boolean)
}

function getRiskLevel(value) {
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

function getRiskLevelLabel(level, locale = DEFAULT_LOCALE) {
  const normalizedLevel = getRiskLevel(level)

  if (locale === 'en') {
    return normalizedLevel === 'high'
      ? 'High'
      : normalizedLevel === 'medium'
        ? 'Medium'
        : 'Low'
  }

  return normalizedLevel === 'high'
    ? 'High'
    : normalizedLevel === 'medium'
      ? 'Medium'
      : 'Low'
}

function mapRiskComponents(raw = {}) {
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

function buildFallbackHistory(currentRiskScore, locale = DEFAULT_LOCALE) {
  const level = getRiskLevelLabel(currentRiskScore, locale)
  const offsets = [-6, -5, -4, -3, -2, -1, 0]

  return offsets.map((offset) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)

    const derivedScore = clampRiskScore(currentRiskScore - Math.max(0, Math.abs(offset) - 2))

    return {
      date: formatDateOnly(date, locale),
      score: String(derivedScore),
      status: getRiskLevelLabel(derivedScore, locale),
      detail:
        locale === 'en'
          ? 'Fallback trend data generated from the latest score.'
          : 'Data tren fallback dibentuk dari skor terbaru.',
      value: derivedScore,
      timestampRaw: date.toISOString(),
    }
  })
}

function buildRiskSummaryDescription({ riskLevel, currentRiskScore, locale }) {
  if (locale === 'en') {
    if (riskLevel === 'High') {
      return `This asset has a high risk score of ${currentRiskScore} and should be prioritized for immediate mitigation.`
    }

    if (riskLevel === 'Medium') {
      return `This asset has a medium risk score of ${currentRiskScore} and should be monitored with targeted mitigation.`
    }

    return `This asset has a low risk score of ${currentRiskScore} and is currently in a relatively controlled condition.`
  }

  if (riskLevel === 'High') {
    return `Aset ini memiliki skor risiko ${currentRiskScore} dengan level tinggi dan perlu segera diprioritaskan untuk mitigasi.`
  }

  if (riskLevel === 'Medium') {
    return `Aset ini memiliki skor risiko ${currentRiskScore} dengan level sedang dan perlu dipantau dengan mitigasi terarah.`
  }

  return `Aset ini memiliki skor risiko ${currentRiskScore} dengan level rendah dan saat ini berada dalam kondisi yang relatif terkendali.`
}

function buildRiskHistoryAnalysis(riskHistory = [], locale = DEFAULT_LOCALE) {
  if (!Array.isArray(riskHistory) || riskHistory.length === 0) {
    return locale === 'en'
      ? 'No historical trend is available yet.'
      : 'Belum ada riwayat tren yang tersedia.'
  }

  const values = riskHistory.map((item) => toNumber(item.value ?? item.score, 0))
  const first = values[0] ?? 0
  const last = values[values.length - 1] ?? 0
  const delta = last - first

  if (locale === 'en') {
    if (delta > 0) {
      return `The risk trend increased by ${delta} points over the observed period, indicating growing exposure that should be reviewed.`
    }

    if (delta < 0) {
      return `The risk trend decreased by ${Math.abs(delta)} points over the observed period, indicating the mitigation posture is improving.`
    }

    return 'The risk trend is relatively stable across the observed period.'
  }

  if (delta > 0) {
    return `Tren risiko meningkat sebesar ${delta} poin pada periode yang diamati, menandakan adanya eksposur yang perlu segera ditinjau.`
  }

  if (delta < 0) {
    return `Tren risiko menurun sebesar ${Math.abs(delta)} poin pada periode yang diamati, menandakan upaya mitigasi mulai membaik.`
  }

  return 'Tren risiko relatif stabil pada periode yang diamati.'
}

function buildVulnerabilityDescription(
  vulnerabilities = [],
  riskComponents = {},
  locale = DEFAULT_LOCALE,
) {
  if (locale === 'en') {
    if (vulnerabilities.length === 0) {
      return 'No vulnerability list is available from the backend yet.'
    }

    return `A total of ${vulnerabilities.length} vulnerability indicators were mapped. The vulnerability component currently contributes ${riskComponents.vulnerability ?? 0} points to the overall score.`
  }

  if (vulnerabilities.length === 0) {
    return 'Belum ada daftar kerentanan yang dikirim backend saat ini.'
  }

  return `Terdapat ${vulnerabilities.length} indikator kerentanan yang terpetakan. Komponen vulnerability saat ini berkontribusi sebesar ${riskComponents.vulnerability ?? 0} poin terhadap skor keseluruhan.`
}

function buildAlertDescription(securityAlerts = [], locale = DEFAULT_LOCALE) {
  if (locale === 'en') {
    if (securityAlerts.length === 0) {
      return 'No recent security alerts are available from the backend yet.'
    }

    return `There are ${securityAlerts.length} alert entries associated with this asset that should be reviewed according to their severity.`
  }

  if (securityAlerts.length === 0) {
    return 'Belum ada alert keamanan terbaru yang dikirim backend saat ini.'
  }

  return `Terdapat ${securityAlerts.length} entri alert yang terkait dengan aset ini dan perlu ditinjau sesuai tingkat severity-nya.`
}

function buildTechnicalAnalysis(
  viewModelSource,
  locale = DEFAULT_LOCALE,
) {
  const {
    currentRiskScore,
    riskLevel,
    riskComponents,
    vulnerabilities,
    securityAlerts,
    riskHistory,
  } = viewModelSource

  const latestHistory = riskHistory[riskHistory.length - 1]
  const dominantComponent = Object.entries(riskComponents || {}).sort(
    (left, right) => right[1] - left[1],
  )[0]

  if (locale === 'en') {
    return [
      `Current risk score is ${currentRiskScore} with ${riskLevel.toLowerCase()} priority.`,
      `Dominant score component: ${dominantComponent?.[0] ?? 'threat'} (${dominantComponent?.[1] ?? 0}).`,
      `${vulnerabilities.length} vulnerability indicators and ${securityAlerts.length} security alerts are currently linked to this asset.`,
      `Latest observed trend status is ${latestHistory?.status ?? riskLevel}.`,
    ]
  }

  return [
    `Skor risiko saat ini berada di ${currentRiskScore} dengan prioritas ${riskLevel.toLowerCase()}.`,
    `Komponen skor yang paling dominan adalah ${dominantComponent?.[0] ?? 'threat'} (${dominantComponent?.[1] ?? 0}).`,
    `Saat ini terdapat ${vulnerabilities.length} indikator kerentanan dan ${securityAlerts.length} alert keamanan yang terkait dengan aset ini.`,
    `Status tren terbaru yang teramati berada pada level ${latestHistory?.status ?? riskLevel}.`,
  ]
}

function buildRecommendations(viewModelSource, locale = DEFAULT_LOCALE) {
  const { riskLevel, vulnerabilities, securityAlerts, riskComponents } =
    viewModelSource

  const recommendations = []

  if (riskLevel === 'High') {
    recommendations.push(
      locale === 'en'
        ? 'Prioritize this asset for immediate mitigation and focused monitoring.'
        : 'Prioritaskan aset ini untuk mitigasi segera dan monitoring terfokus.',
    )
  }

  if ((riskComponents?.vulnerability ?? 0) > 0 || vulnerabilities.length > 0) {
    recommendations.push(
      locale === 'en'
        ? 'Review and patch the vulnerability indicators associated with this asset.'
        : 'Tinjau dan lakukan patch pada indikator kerentanan yang terkait dengan aset ini.',
    )
  }

  if (securityAlerts.length > 0) {
    recommendations.push(
      locale === 'en'
        ? 'Validate recent security alerts and correlate them with asset activity.'
        : 'Validasi alert keamanan terbaru dan korelasikan dengan aktivitas aset.',
    )
  }

  recommendations.push(
    locale === 'en'
      ? 'Continue periodic monitoring to confirm that the risk trend is improving.'
      : 'Lanjutkan monitoring berkala untuk memastikan tren risiko membaik.',
  )

  return recommendations.slice(0, 4)
}

function buildConclusion(viewModelSource, locale = DEFAULT_LOCALE) {
  const { assetName, currentRiskScore, riskLevel } = viewModelSource

  if (locale === 'en') {
    return `${assetName} currently has a ${riskLevel.toLowerCase()} risk posture with a score of ${currentRiskScore}. The recommended mitigations should be executed to reduce exposure and stabilize the trend.`
  }

  return `${assetName} saat ini memiliki postur risiko ${riskLevel.toLowerCase()} dengan skor ${currentRiskScore}. Mitigasi yang direkomendasikan perlu dijalankan agar eksposur menurun dan tren risiko menjadi lebih stabil.`
}

export function mapAssetDetail(raw = {}, options = {}) {
  const locale = normalizeLocale(options.locale)

  const assetId = normalizeString(
    pickFirst(raw, ['asset_id', 'assetId', 'id', 'hostname'], ''),
  )

  const assetName = normalizeString(
    pickFirst(
      raw,
      ['asset_name', 'assetName', 'name', 'hostname', 'host_name', 'agent_name'],
      assetId,
    ),
    assetId || '-',
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
    ],
    null,
  )

  return {
    id: assetId || assetName,
    assetId: assetId || assetName,
    reportTitle: assetName,
    assetName,
    assetType: normalizeString(
      pickFirst(
        raw,
        ['asset_type', 'assetType', 'type', 'category', 'platform'],
        locale === 'en' ? 'Asset Type' : 'Server',
      ),
      locale === 'en' ? 'Asset Type' : 'Server',
    ),
    status: normalizeString(
      pickFirst(raw, ['status', 'state', 'asset_status'], 'Active'),
      'Active',
    ),
    ipAddress: normalizeString(
      pickFirst(raw, ['ip_address', 'ipAddress', 'ip', 'agent_ip'], '-'),
      '-',
    ),
    hostname: normalizeString(
      pickFirst(raw, ['hostname', 'host_name', 'name'], assetName),
      assetName,
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
    securityAlerts: mapSecurityAlerts(
      pickFirst(raw, ['security_alerts', 'securityAlerts', 'alerts'], []),
      locale,
    ),
    raw,
  }
}

export function mapAssetScore(raw = {}, options = {}) {
  const locale = normalizeLocale(options.locale)

  const assetId = normalizeString(
    pickFirst(raw, ['asset_id', 'assetId', 'id', 'hostname'], ''),
  )

  const currentRiskScore = clampRiskScore(
    pickFirst(raw, ['risk_score', 'riskScore', 'score', 'value'], 0),
  )

  const riskLevel = getRiskLevelLabel(
    pickFirst(raw, ['risk_level', 'riskLevel', 'level', 'status'], currentRiskScore),
    locale,
  )

  const updatedAtRaw = pickFirst(
    raw,
    ['timestamp', 'updated_at', 'updatedAt', 'calculated_at', 'calculatedAt'],
    null,
  )

  return {
    id: assetId || 'asset-score',
    assetId: assetId || 'asset-score',
    currentRiskScore,
    riskLevel,
    updatedAt: formatDateTime(updatedAtRaw, locale),
    updatedAtRaw,
    riskComponents: mapRiskComponents(raw),
    vulnerabilities: extractStringArray(
      pickFirst(raw, ['vulnerabilities', 'vulns', 'cves'], []),
    ),
    securityAlerts: mapSecurityAlerts(
      pickFirst(raw, ['security_alerts', 'securityAlerts', 'alerts'], []),
      locale,
    ),
    raw,
  }
}

export function mapAssetTrend(raw = {}, options = {}) {
  const locale = normalizeLocale(options.locale)
  const points = Array.isArray(raw)
    ? raw
    : extractCollection(raw, ['trends', 'history', 'items', 'data'])

  return points.map((point, index) => {
    const score = clampRiskScore(
      pickFirst(point, ['risk_score', 'riskScore', 'score', 'value'], 0),
    )

    const timestampRaw = pickFirst(
      point,
      ['timestamp', 'date', 'time', 'updated_at', 'created_at'],
      null,
    )

    const status = getRiskLevelLabel(
      pickFirst(point, ['risk_level', 'riskLevel', 'level', 'status'], score),
      locale,
    )

    const previousPoint = points[index - 1]
    const previousScore = clampRiskScore(
      pickFirst(previousPoint, ['risk_score', 'riskScore', 'score', 'value'], score),
    )

    let fallbackDetail =
      locale === 'en'
        ? 'Risk movement is stable.'
        : 'Pergerakan risiko relatif stabil.'

    if (score > previousScore) {
      fallbackDetail =
        locale === 'en'
          ? 'Risk score increased from the previous observation.'
          : 'Skor risiko meningkat dibanding observasi sebelumnya.'
    }

    if (score < previousScore) {
      fallbackDetail =
        locale === 'en'
          ? 'Risk score decreased from the previous observation.'
          : 'Skor risiko menurun dibanding observasi sebelumnya.'
    }

    return {
      date: formatDateOnly(timestampRaw, locale),
      score: String(score),
      status,
      detail: normalizeString(
        pickFirst(point, ['detail', 'description', 'summary', 'note'], fallbackDetail),
        fallbackDetail,
      ),
      value: score,
      timestampRaw,
    }
  })
}

export function buildAssetDetailViewModel({
  asset,
  score,
  trend,
  fallbackId = 'asset-01',
  locale = DEFAULT_LOCALE,
} = {}) {
  const normalizedLocale = normalizeLocale(locale)

  const mappedAsset =
    asset?.assetName && asset?.assetType
      ? asset
      : mapAssetDetail(asset, { locale: normalizedLocale })

  const mappedScore =
    score?.currentRiskScore !== undefined
      ? score
      : mapAssetScore(score, { locale: normalizedLocale })

  const mappedTrend =
    Array.isArray(trend) && trend[0]?.date
      ? trend
      : mapAssetTrend(trend, { locale: normalizedLocale })

  const assetId =
    mappedAsset.assetId ||
    mappedScore.assetId ||
    normalizeString(fallbackId, 'asset-01')

  const currentRiskScore =
    mappedScore.currentRiskScore !== undefined ? mappedScore.currentRiskScore : 0

  const riskLevel =
    mappedScore.riskLevel || getRiskLevelLabel(currentRiskScore, normalizedLocale)

  const riskComponents = mappedScore.riskComponents || mapRiskComponents({})

  const vulnerabilities = [
    ...new Set([
      ...(mappedAsset.vulnerabilities || []),
      ...(mappedScore.vulnerabilities || []),
    ]),
  ]

  const securityAlerts = [
    ...mappedAsset.securityAlerts,
    ...mappedScore.securityAlerts.filter(
      (item) =>
        !mappedAsset.securityAlerts.some(
          (existing) =>
            existing.description === item.description &&
            existing.severity === item.severity,
        ),
    ),
  ]

  const riskHistory =
    mappedTrend.length > 0
      ? mappedTrend
      : buildFallbackHistory(currentRiskScore, normalizedLocale)

  const viewModelSource = {
    assetName: mappedAsset.assetName || assetId,
    currentRiskScore,
    riskLevel,
    riskComponents,
    vulnerabilities,
    securityAlerts,
    riskHistory,
  }

  return {
    id: assetId,
    reportTitle: mappedAsset.reportTitle || mappedAsset.assetName || assetId,
    assetName: mappedAsset.assetName || assetId,
    assetType: mappedAsset.assetType || 'Server',
    status: mappedAsset.status || 'Active',
    ipAddress: mappedAsset.ipAddress || '-',
    updatedAt:
      mappedScore.updatedAt && mappedScore.updatedAt !== '-'
        ? mappedScore.updatedAt
        : mappedAsset.updatedAt || '-',
    currentRiskScore,
    riskLevel,
    riskSummaryDescription: buildRiskSummaryDescription({
      riskLevel,
      currentRiskScore,
      locale: normalizedLocale,
    }),
    riskHistory,
    riskHistoryAnalysis: buildRiskHistoryAnalysis(riskHistory, normalizedLocale),
    vulnerabilities,
    vulnerabilityDescription: buildVulnerabilityDescription(
      vulnerabilities,
      riskComponents,
      normalizedLocale,
    ),
    securityAlerts,
    alertDescription: buildAlertDescription(securityAlerts, normalizedLocale),
    technicalAnalysis: buildTechnicalAnalysis(viewModelSource, normalizedLocale),
    recommendations: buildRecommendations(viewModelSource, normalizedLocale),
    conclusion: buildConclusion(viewModelSource, normalizedLocale),
    riskComponents,
    raw: {
      asset: mappedAsset.raw || asset,
      score: mappedScore.raw || score,
      trend,
    },
  }
}