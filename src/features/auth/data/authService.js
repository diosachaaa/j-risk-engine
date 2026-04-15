import {
  registerWithEmail,
  loginWithEmail,
  logoutFirebase,
  getFirebaseIdToken,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from './firebaseAuth'
import {
  signInWithBackend,
  completeProfile,
  requestBackendEmailVerification,
  requestBackendPasswordReset,
} from './authApi'
import {
  saveAccessToken,
  saveSession,
  savePendingRole,
  getPendingRole,
  clearPendingRole,
  clearAuthStorage,
} from './authStorage'
import { mapBackendAuthResponse } from './authMappers'

function persistBackendSession(mappedAuth) {
  if (!mappedAuth?.session?.accessToken) {
    return mappedAuth
  }

  saveAccessToken(mappedAuth.session.accessToken)
  saveSession(mappedAuth.session)

  return mappedAuth
}

export async function registerFlow({
  email,
  password,
  displayName,
  role,
}) {
  const user = await registerWithEmail({
    email,
    password,
    displayName,
  })

  if (role) {
    savePendingRole(role)
  }

  await sendVerificationEmail()

  return {
    user,
    requiresEmailVerification: true,
    pendingRole: role ?? null,
  }
}

export async function loginFlow({ email, password }) {
  await loginWithEmail({ email, password })

  const idToken = await getFirebaseIdToken()
  const response = await signInWithBackend(idToken)
  const mapped = mapBackendAuthResponse(response)

  return persistBackendSession(mapped)
}

export async function completeProfileFlow(role) {
  const selectedRole = role || getPendingRole()

  if (!selectedRole) {
    throw new Error('Role belum dipilih')
  }

  const idToken = await getFirebaseIdToken(true)
  const response = await completeProfile({
    idToken,
    role: selectedRole,
  })

  const mapped = mapBackendAuthResponse(response)

  clearPendingRole()

  return persistBackendSession(mapped)
}

export async function resendVerificationFlow() {
  const idToken = await getFirebaseIdToken(true)

  try {
    return await requestBackendEmailVerification(idToken)
  } catch {
    await sendVerificationEmail()
    return { message: 'Email verifikasi berhasil dikirim ulang' }
  }
}

export async function forgotPasswordFlow(email) {
  try {
    return await requestBackendPasswordReset(email)
  } catch {
    await sendResetPasswordEmail(email)
    return { message: 'Email reset password berhasil dikirim' }
  }
}

export async function exchangeFirebaseTokenForSession(forceRefresh = false) {
  const idToken = await getFirebaseIdToken(forceRefresh)
  const response = await signInWithBackend(idToken)
  const mapped = mapBackendAuthResponse(response)

  return persistBackendSession(mapped)
}

export async function logoutFlow() {
  clearAuthStorage()
  await logoutFirebase()
}