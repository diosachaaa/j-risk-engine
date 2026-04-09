import assetDetailMock from './assetDetailMock'
import { buildAssetDetailViewModel } from './assetDetailMappers'

function normalizeCollection(source) {
  if (Array.isArray(source)) return source

  if (source && Array.isArray(source.items)) return source.items
  if (source && Array.isArray(source.data)) return source.data
  if (source && Array.isArray(source.assets)) return source.assets

  return []
}

function normalizeAssetId(value, fallback = 'asset-01') {
  if (value === undefined || value === null) return fallback

  const normalized = String(value).trim()

  return normalized || fallback
}

function getRawAssetId(item) {
  if (!item || typeof item !== 'object') return ''

  return (
    item.asset_id ||
    item.assetId ||
    item.id ||
    item.assetName ||
    item.asset_name ||
    item.hostname ||
    ''
  )
}

const mockItems = normalizeCollection(assetDetailMock)

export function getAssetDetailById(assetId) {
  const normalizedAssetId = normalizeAssetId(assetId)

  const matchedItem = mockItems.find((item) => {
    return normalizeAssetId(getRawAssetId(item), '') === normalizedAssetId
  })

  if (!matchedItem) {
    return null
  }

  return buildAssetDetailViewModel({
    asset: matchedItem,
    score: matchedItem,
    trend: matchedItem.riskHistory ?? matchedItem.trend ?? [],
    fallbackId: normalizedAssetId,
  })
}

export function getFallbackAssetDetail(assetId) {
  const normalizedAssetId = normalizeAssetId(assetId)

  const existingMockDetail = getAssetDetailById(normalizedAssetId)

  if (existingMockDetail) {
    return existingMockDetail
  }

  return buildAssetDetailViewModel({
    asset: {
      asset_id: normalizedAssetId,
      asset_name: normalizedAssetId,
      asset_type: 'Server',
      status: 'Active',
      ip_address: '-',
      updated_at: new Date().toISOString(),
      vulnerabilities: [],
      security_alerts: [],
    },
    score: {
      asset_id: normalizedAssetId,
      risk_score: 0,
      risk_level: 'low',
      risk_components: {
        threat: 0,
        vulnerability: 0,
        criticality: 0,
      },
      timestamp: new Date().toISOString(),
    },
    trend: [],
    fallbackId: normalizedAssetId,
  })
}

const assetDetailData = {
  getAssetDetailById,
  getFallbackAssetDetail,
}

export default assetDetailData