import apiClient, {
  buildApiPath,
  unwrapResponseData,
} from '../../../shared/api/apiClient'

function normalizeAssetId(assetId) {
  if (assetId === undefined || assetId === null || String(assetId).trim() === '') {
    throw new Error('assetId wajib diisi.')
  }

  return encodeURIComponent(String(assetId).trim())
}

export async function getAssetDetail(assetId, config = {}) {
  const normalizedAssetId = normalizeAssetId(assetId)

  const response = await apiClient.get(
    buildApiPath(`/assets/${normalizedAssetId}`),
    config,
  )

  return unwrapResponseData(response)
}

export async function getAssetScore(assetId, config = {}) {
  const normalizedAssetId = normalizeAssetId(assetId)

  const response = await apiClient.get(
    buildApiPath(`/scores/${normalizedAssetId}`),
    config,
  )

  return unwrapResponseData(response)
}

export async function getAssetTrend(assetId, config = {}) {
  const normalizedAssetId = normalizeAssetId(assetId)

  const response = await apiClient.get(
    buildApiPath(`/trends/${normalizedAssetId}`),
    config,
  )

  return unwrapResponseData(response)
}

const assetDetailApi = {
  getAssetDetail,
  getAssetScore,
  getAssetTrend,
}

export default assetDetailApi