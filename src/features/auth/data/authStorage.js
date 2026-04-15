import { AUTH_STORAGE_KEYS } from '../constants/authStorageKeys'

export function saveAccessToken(token) {
  if (!token) {
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token)
}

export function getAccessToken() {
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
}

export function clearAccessToken() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)
}

export function saveSession(session) {
  if (!session) {
    return
  }

  localStorage.setItem(
    AUTH_STORAGE_KEYS.SESSION,
    JSON.stringify(session)
  )
}

export function getSession() {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession)
  } catch {
    clearSession()
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION)
}

export function savePendingRole(role) {
  if (!role) {
    return
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.PENDING_ROLE, role)
}

export function getPendingRole() {
  return localStorage.getItem(AUTH_STORAGE_KEYS.PENDING_ROLE)
}

export function clearPendingRole() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.PENDING_ROLE)
}

export function clearAuthStorage() {
  clearAccessToken()
  clearSession()
  clearPendingRole()
}