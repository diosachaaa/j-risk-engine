import axios from 'axios'
import {
  getAccessToken,
  clearAuthStorage,
} from '../../features/auth/data/authStorage'

const DEFAULT_API_BASE_URL = 'https://capstonedev-production.up.railway.app'

function normalizeBaseUrl(baseUrl) {
  if (typeof baseUrl !== 'string' || baseUrl.trim() === '') {
    return DEFAULT_API_BASE_URL
  }

  return baseUrl.trim().replace(/\/+$/, '')
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

export function buildApiPath(path = '') {
  const normalizedPath = `/${String(path).replace(/^\/+/, '')}`

  return normalizedPath.replace(/\/{2,}/g, '/')
}

export function unwrapResponseData(response) {
  return response?.data ?? null
}

function extractErrorMessage(errorData, fallbackMessage) {
  if (!errorData) return fallbackMessage

  if (typeof errorData === 'string' && errorData.trim() !== '') {
    return errorData
  }

  if (typeof errorData?.detail === 'string' && errorData.detail.trim() !== '') {
    return errorData.detail
  }

  if (typeof errorData?.message === 'string' && errorData.message.trim() !== '') {
    return errorData.message
  }

  if (typeof errorData?.error === 'string' && errorData.error.trim() !== '') {
    return errorData.error
  }

  return fallbackMessage
}

export function normalizeApiError(
  error,
  fallbackMessage = 'Terjadi kesalahan saat mengambil data.',
) {
  if (error?.isApiError) return error

  const status = error?.response?.status ?? null
  const data = error?.response?.data ?? null

  const message = extractErrorMessage(
    data,
    error?.message || fallbackMessage,
  )

  const normalizedError = new Error(message)

  normalizedError.name = 'ApiError'
  normalizedError.status = status
  normalizedError.data = data
  normalizedError.code = error?.code ?? null
  normalizedError.isApiError = true
  normalizedError.originalError = error

  return normalizedError
}

export function getApiErrorMessage(
  error,
  fallbackMessage = 'Terjadi kesalahan saat mengambil data.',
) {
  return normalizeApiError(error, fallbackMessage).message
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(normalizeApiError(error)),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status ?? null
    const currentPath = window.location.pathname

    if (status === 401) {
      clearAuthStorage()

      if (!currentPath.startsWith('/auth')) {
        window.location.href = '/auth/login'
      }
    }

    if (status === 403) {
      const detail =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        ''

      const normalizedDetail =
        typeof detail === 'string' ? detail.toLowerCase() : ''

      const isRoleError = normalizedDetail.includes('role')
      const isVerificationError = normalizedDetail.includes('verified')

      if (isVerificationError && !currentPath.startsWith('/auth')) {
        window.location.href = '/auth/verify-email'
      }

      if (isRoleError && currentPath.startsWith('/dashboard/ciso')) {
        window.location.href = '/dashboard/management'
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)

export default apiClient