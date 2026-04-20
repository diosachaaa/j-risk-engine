import apiClient, {
  buildApiPath,
  unwrapResponseData,
} from '../../../../shared/api/apiClient'

function normalizeAssetId(assetId) {
  if (assetId === undefined || assetId === null || String(assetId).trim() === '') {
    throw new Error('assetId wajib diisi.')
  }

  return encodeURIComponent(String(assetId).trim())
}

export async function getAssets(config = {}) {
  const response = await apiClient.get(buildApiPath('/assets'), {
    params: {
      limit: 200,
      ...(config.params || {}),
    },
    ...config,
  })

  return unwrapResponseData(response)
}

export async function getLatestScores(config = {}) {
  const response = await apiClient.get(buildApiPath('/scores/latest'), config)

  return unwrapResponseData(response)
}

export async function getDashboardSummary(config = {}) {
  const response = await apiClient.get(buildApiPath('/dashboard/summary'), config)

  return unwrapResponseData(response)
}

export async function getDashboardRiskTrend(config = {}) {
  const response = await apiClient.get(buildApiPath('/dashboard/risk-trend'), config)

  return unwrapResponseData(response)
}

export async function getDashboardAssetsTable(config = {}) {
  const response = await apiClient.get(buildApiPath('/dashboard/assets-table'), {
    params: {
      page: 1,
      page_size: 200,
      ...(config.params || {}),
    },
    ...config,
  })

  return unwrapResponseData(response)
}

export async function getAssetById(assetId, config = {}) {
  const normalizedAssetId = normalizeAssetId(assetId)

  const response = await apiClient.get(
    buildApiPath(`/assets/${normalizedAssetId}`),
    config,
  )

  return unwrapResponseData(response)
}

const dashboardApi = {
  getAssets,
  getLatestScores,
  getDashboardSummary,
  getDashboardRiskTrend,
  getDashboardAssetsTable,
  getAssetById,
}

export default dashboardApi