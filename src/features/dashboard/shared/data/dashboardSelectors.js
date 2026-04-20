import {
  buildAssetLookupKey,
  getRiskStatusLabel,
  mapAsset,
  mapAssetsTablePayload,
  mapAssetsPayload,
  mapDashboardRow,
  mapLatestScore,
  mapLatestScoresPayload,
} from './dashboardMappers'

function normalizeLocale(locale = 'id') {
  return locale === 'en' ? 'en' : 'id'
}

function toNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '')
    const parsed = Number(normalized)

    return Number.isFinite(parsed) ? parsed : fallback
  }

  return fallback
}

function toNonNegativeInteger(value, fallback = 0) {
  return Math.max(0, Math.round(toNumber(value, fallback)))
}

function hasField(source = {}, key) {
  return source[key] !== undefined && source[key] !== null
}

function getSummarySource(summaryInput = {}) {
  if (!summaryInput || typeof summaryInput !== 'object') {
    return {}
  }

  const dataCandidate = summaryInput.data

  if (
    dataCandidate &&
    typeof dataCandidate === 'object' &&
    !Array.isArray(dataCandidate)
  ) {
    return dataCandidate
  }

  return summaryInput
}

function getRiskDistributionSource(summarySource = {}) {
  const distributionCandidate =
    summarySource.risk_distribution ||
    summarySource.riskDistribution ||
    summarySource.distribution

  if (
    distributionCandidate &&
    typeof distributionCandidate === 'object' &&
    !Array.isArray(distributionCandidate)
  ) {
    return distributionCandidate
  }

  return {}
}

export function mapDashboardSummaryPayload(summaryInput = {}) {
  const source = getSummarySource(summaryInput)
  const distributionSource = getRiskDistributionSource(source)

  const hasTotalField =
    hasField(source, 'total_assets') ||
    hasField(source, 'totalAssets') ||
    hasField(source, 'total')

  const hasDistributionField =
    hasField(distributionSource, 'low') ||
    hasField(distributionSource, 'medium') ||
    hasField(distributionSource, 'high') ||
    hasField(distributionSource, 'critical')

  if (!hasTotalField && !hasDistributionField) {
    return null
  }

  const low = toNonNegativeInteger(
    distributionSource.low,
    toNumber(source.low, 0),
  )
  const medium = toNonNegativeInteger(
    distributionSource.medium,
    toNumber(source.medium, 0),
  )
  const high = toNonNegativeInteger(
    distributionSource.high,
    toNumber(source.high, 0),
  )
  const critical = toNonNegativeInteger(
    distributionSource.critical,
    toNumber(source.critical, 0),
  )

  const totalFromDistribution = low + medium + high + critical

  return {
    total: toNonNegativeInteger(
      source.total_assets ?? source.totalAssets ?? source.total,
      totalFromDistribution,
    ),
    low,
    medium,
    high,
    critical,
  }
}

function toTimestamp(value) {
  if (!value) return 0

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return 0

  return date.getTime()
}

function normalizeAssetsInput(assetsInput, options = {}) {
  if (!Array.isArray(assetsInput)) {
    return mapAssetsPayload(assetsInput, options)
  }

  return assetsInput.map((item) =>
    item?.assetId || item?.name ? item : mapAsset(item, options),
  )
}

function normalizeScoresInput(scoresInput, options = {}) {
  if (!Array.isArray(scoresInput)) {
    return mapLatestScoresPayload(scoresInput, options)
  }

  return scoresInput.map((item) =>
    item?.score !== undefined || item?.riskComponents
      ? item
      : mapLatestScore(item, options),
  )
}

function normalizeAssetsTableInput(assetsTableInput, options = {}) {
  if (!Array.isArray(assetsTableInput)) {
    return mapAssetsTablePayload(assetsTableInput, options)
  }

  return assetsTableInput.map((item) =>
    item?.assetId || item?.name
      ? item
      : mapDashboardRow(item, item, { locale: options.locale }),
  )
}

export function sortRowsByRisk(rows = []) {
  return [...rows].sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score

    const rightTimestamp = toTimestamp(right.updatedAtRaw)
    const leftTimestamp = toTimestamp(left.updatedAtRaw)

    if (rightTimestamp !== leftTimestamp) return rightTimestamp - leftTimestamp

    return String(left.name).localeCompare(String(right.name))
  })
}

export function mergeAssetsWithScores(
  assetsInput = [],
  scoresInput = [],
  options = {},
) {
  const locale = normalizeLocale(options.locale)
  const assets = normalizeAssetsInput(assetsInput, { locale })
  const scores = normalizeScoresInput(scoresInput, { locale })

  const assetsMap = new Map()
  const scoresMap = new Map()

  assets.forEach((asset) => {
    const key = buildAssetLookupKey(asset.assetId || asset.id || asset.name)

    if (key) {
      assetsMap.set(key, asset)
    }
  })

  scores.forEach((score) => {
    const key = buildAssetLookupKey(score.assetId || score.id)

    if (key) {
      scoresMap.set(key, score)
    }
  })

  const mergedKeys = new Set([...assetsMap.keys(), ...scoresMap.keys()])

  const rows = Array.from(mergedKeys).map((key) =>
    mapDashboardRow(assetsMap.get(key), scoresMap.get(key), { locale }),
  )

  return sortRowsByRisk(rows)
}

export function buildAssetsTableRows(assetsTableInput = [], options = {}) {
  const locale = normalizeLocale(options.locale)
  const rows = normalizeAssetsTableInput(assetsTableInput, { locale })

  return sortRowsByRisk(rows)
}

export function buildDashboardSummary(rowsInput = []) {
  const rows = Array.isArray(rowsInput) ? rowsInput : []

  const summary = rows.reduce(
    (result, row) => {
      result.total += 1
      result.totalScore += row.score

      if (row.level === 'low') result.low += 1
      if (row.level === 'medium') result.medium += 1
      if (row.level === 'high') result.high += 1
      if (row.level === 'critical') result.critical += 1

      if (!result.highestAsset || row.score > result.highestAsset.score) {
        result.highestAsset = row
      }

      if (!result.lowestAsset || row.score < result.lowestAsset.score) {
        result.lowestAsset = row
      }

      if (
        !result.latestRow ||
        toTimestamp(row.updatedAtRaw) > toTimestamp(result.latestRow.updatedAtRaw)
      ) {
        result.latestRow = row
      }

      return result
    },
    {
      total: 0,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      totalScore: 0,
      averageScore: 0,
      totalAtRisk: 0,
      highestAsset: null,
      lowestAsset: null,
      latestRow: null,
      lastUpdated: '-',
    },
  )

  summary.averageScore =
    summary.total > 0 ? Math.round(summary.totalScore / summary.total) : 0

  summary.totalAtRisk = summary.medium + summary.high + summary.critical
  summary.lastUpdated = summary.latestRow?.updatedAt ?? '-'

  return summary
}

export function mergeDashboardSummary(summaryInput = {}, summaryPayload = null) {
  const mappedSummary = mapDashboardSummaryPayload(summaryPayload)

  if (!mappedSummary) {
    return summaryInput
  }

  const safeSummary =
    summaryInput && typeof summaryInput === 'object' ? summaryInput : {}

  return {
    ...safeSummary,
    ...mappedSummary,
    totalAtRisk: mappedSummary.medium + mappedSummary.high + mappedSummary.critical,
  }
}

export function buildDistribution(summaryInput = {}) {
  const summary = {
    total: summaryInput.total ?? 0,
    low: summaryInput.low ?? 0,
    medium: summaryInput.medium ?? 0,
    high: summaryInput.high ?? 0,
    critical: summaryInput.critical ?? 0,
  }

  const colorMap = {
    low: '#cfe2d0',
    medium: '#f1d9aa',
    high: '#f5b281',
    critical: '#eda1a5',
  }

  return ['low', 'medium', 'high', 'critical'].map((level) => ({
    level,
    value: summary[level],
    percentage:
      summary.total > 0
        ? Math.round((summary[level] / summary.total) * 100)
        : 0,
    color: colorMap[level],
  }))
}

export function buildTopRiskRows(rowsInput = [], limit = 10) {
  return sortRowsByRisk(rowsInput).slice(0, limit)
}

export function buildSecurityStatusItems(summaryInput = {}, locale = 'id') {
  const normalizedLocale = normalizeLocale(locale)
  const labelMap =
    normalizedLocale === 'en'
      ? {
        low: 'Secure',
        medium: 'Warning',
        high: 'High Risk',
        critical: 'Critical',
      }
      : {
        low: 'Secure',
        medium: 'Warning',
        high: 'Risiko Tinggi',
        critical: 'Kritis',
      }

  return [
    {
      label: labelMap.low,
      value: summaryInput.low ?? 0,
      suffix: 'Assets',
      tone: 'green',
    },
    {
      label: labelMap.medium,
      value: summaryInput.medium ?? 0,
      suffix: 'Assets',
      tone: 'yellow',
    },
    {
      label: labelMap.high,
      value: summaryInput.high ?? 0,
      suffix: 'Assets',
      tone: 'orange',
    },
    {
      label: labelMap.critical,
      value: summaryInput.critical ?? 0,
      suffix: 'Assets',
      tone: 'red',
    },
  ]
}

function getDominantLevel(summary) {
  const levels = [
    { level: 'critical', value: summary.critical ?? 0 },
    { level: 'high', value: summary.high ?? 0 },
    { level: 'medium', value: summary.medium ?? 0 },
    { level: 'low', value: summary.low ?? 0 },
  ]

  return levels.sort((left, right) => right.value - left.value)[0]?.level ?? 'low'
}

export function buildTechnicalAnalysisPoints(rowsInput = [], locale = 'id') {
  const normalizedLocale = normalizeLocale(locale)
  const summary = buildDashboardSummary(rowsInput)
  const dominantLevel = getDominantLevel(summary)
  const dominantLabel = getRiskStatusLabel(dominantLevel, normalizedLocale)

  if (summary.total === 0) {
    return []
  }

  if (normalizedLocale === 'en') {
    return [
      {
        id: 'analysis-average-score',
        segments: [
          { text: 'The average risk score is ' },
          { text: `${summary.averageScore}`, highlight: true },
          { text: ' across all monitored assets.' },
        ],
      },
      {
        id: 'analysis-top-asset',
        segments: [
          { text: 'The highest-risk asset is ' },
          { text: summary.highestAsset?.name ?? '-', highlight: true },
          { text: ' with a score of ' },
          { text: `${summary.highestAsset?.score ?? 0}`, highlight: true },
          { text: '.' },
        ],
      },
      {
        id: 'analysis-priority-assets',
        segments: [
          { text: 'There are ' },
          { text: `${summary.critical}`, highlight: true },
          { text: ' critical assets, ' },
          { text: `${summary.high}`, highlight: true },
          { text: ' high-risk assets, and ' },
          { text: `${summary.medium}`, highlight: true },
          { text: ' medium-risk assets that should be prioritized.' },
        ],
      },
      {
        id: 'analysis-dominant-level',
        segments: [
          { text: 'Most assets are currently in the ' },
          { text: dominantLabel, highlight: true },
          { text: ' category.' },
        ],
      },
    ]
  }

  return [
    {
      id: 'analysis-average-score',
      segments: [
        { text: 'Rata-rata skor risiko seluruh aset berada di ' },
        { text: `${summary.averageScore}`, highlight: true },
        { text: '.' },
      ],
    },
    {
      id: 'analysis-top-asset',
      segments: [
        { text: 'Aset dengan risiko tertinggi saat ini adalah ' },
        { text: summary.highestAsset?.name ?? '-', highlight: true },
        { text: ' dengan skor ' },
        { text: `${summary.highestAsset?.score ?? 0}`, highlight: true },
        { text: '.' },
      ],
    },
    {
      id: 'analysis-priority-assets',
      segments: [
        { text: 'Terdapat ' },
        { text: `${summary.critical}`, highlight: true },
        { text: ' aset kritis, ' },
        { text: `${summary.high}`, highlight: true },
        { text: ' aset berisiko tinggi, dan ' },
        { text: `${summary.medium}`, highlight: true },
        { text: ' aset berisiko sedang yang perlu diprioritaskan.' },
      ],
    },
    {
      id: 'analysis-dominant-level',
      segments: [
        { text: 'Mayoritas aset saat ini berada pada kategori ' },
        { text: dominantLabel, highlight: true },
        { text: '.' },
      ],
    },
  ]
}

export function buildManagementInsightsData(
  rowsInput = [],
  trendData = [],
  options = {},
) {
  const locale = normalizeLocale(options.locale)
  const summary = buildDashboardSummary(rowsInput)
  const rows = sortRowsByRisk(rowsInput)
  const highestAsset = rows[0] ?? null

  const normalizedTrendData = Array.isArray(trendData) ? trendData : []

  const peakTrendPoint =
    normalizedTrendData.length > 0
      ? normalizedTrendData.reduce((peak, item) => {
        if (!peak || (item?.value ?? 0) > (peak?.value ?? 0)) return item
        return peak
      }, null)
      : null

  const overallRiskAverage =
    normalizedTrendData.length > 0
      ? Math.round(
        normalizedTrendData.reduce((sum, item) => sum + (item?.value ?? 0), 0) /
        normalizedTrendData.length,
      )
      : summary.averageScore

  const riskIncrease =
    normalizedTrendData.length >= 2 && (normalizedTrendData[0]?.value ?? 0) !== 0
      ? Math.round(
        (((normalizedTrendData[normalizedTrendData.length - 1]?.value ?? 0) -
          (normalizedTrendData[0]?.value ?? 0)) /
          normalizedTrendData[0].value) *
        100,
      )
      : 0

  const insights =
    locale === 'en'
      ? [
        {
          id: 'management-insight-01',
          segments: [
            { text: 'The average risk index is ' },
            { text: `${overallRiskAverage}`, highlight: true },
            { text: ' with a change of ' },
            { text: `${Math.abs(riskIncrease)}%`, highlight: true },
            { text: ' from the start of the trend.' },
          ],
        },
        {
          id: 'management-insight-02',
          segments: [
            { text: 'The highest-risk asset is ' },
            { text: highestAsset?.name ?? '-', highlight: true },
            { text: ' with a score of ' },
            { text: `${highestAsset?.score ?? 0}`, highlight: true },
            { text: '.' },
          ],
        },
        {
          id: 'management-insight-03',
          segments: [
            { text: 'Recommended priority: ' },
            { text: `${summary.critical}`, highlight: true },
            { text: ' critical assets, ' },
            { text: `${summary.high}`, highlight: true },
            { text: ' high-risk assets, and ' },
            { text: `${summary.medium}`, highlight: true },
            { text: ' medium-risk assets.' },
          ],
        },
      ]
      : [
        {
          id: 'management-insight-01',
          segments: [
            { text: 'Rata-rata indeks risiko berada di ' },
            { text: `${overallRiskAverage}`, highlight: true },
            { text: ' dengan perubahan ' },
            { text: `${Math.abs(riskIncrease)}%`, highlight: true },
            { text: ' dari awal tren.' },
          ],
        },
        {
          id: 'management-insight-02',
          segments: [
            { text: 'Aset dengan risiko tertinggi adalah ' },
            { text: highestAsset?.name ?? '-', highlight: true },
            { text: ' dengan skor ' },
            { text: `${highestAsset?.score ?? 0}`, highlight: true },
            { text: '.' },
          ],
        },
        {
          id: 'management-insight-03',
          segments: [
            { text: 'Prioritas mitigasi awal: ' },
            { text: `${summary.critical}`, highlight: true },
            { text: ' aset kritis, ' },
            { text: `${summary.high}`, highlight: true },
            { text: ' aset tinggi, dan ' },
            { text: `${summary.medium}`, highlight: true },
            { text: ' aset sedang.' },
          ],
        },
      ]

  return {
    summary,
    highestAsset,
    peakTrendPoint,
    overallRiskAverage,
    riskIncrease,
    insights,
  }
}