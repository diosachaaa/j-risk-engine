import {
  loginWithEmail,
  logoutFirebase,
  getFirebaseIdToken,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from './firebaseAuth';
import {
  registerWithBackend,
  signInWithBackend,
  requestBackendEmailVerification,
  requestBackendPasswordReset,
} from './authApi';
import { saveAccessToken, saveSession, clearAuthStorage } from './authStorage';
import { mapBackendAuthResponse } from './authMappers';

function persistBackendSession(mappedAuth) {
  if (!mappedAuth?.session?.accessToken) {
    return mappedAuth;
  }

  saveAccessToken(mappedAuth.session.accessToken);
  saveSession(mappedAuth.session);

  return mappedAuth;
}

async function exchangeWithActivationFallback(forceRefresh = false) {
  const idToken = await getFirebaseIdToken(forceRefresh);
  const response = await signInWithBackend(idToken);
  const mapped = mapBackendAuthResponse(response);

  // First sign-in after verification can activate account without returning session.
  // Retry once with a refreshed token so user can proceed without pressing login again.
  if (mapped?.accountActivated && !mapped?.session) {
    const refreshedToken = await getFirebaseIdToken(true);
    const retryResponse = await signInWithBackend(refreshedToken);
    const retryMapped = mapBackendAuthResponse(retryResponse);

    return persistBackendSession(retryMapped);
  }

  return persistBackendSession(mapped);
}

export async function registerFlow({
  name,
  username,
  email,
  password,
  confirmPassword,
  role,
}) {
  const response = await registerWithBackend({
    name,
    username,
    email,
    role,
    password,
    confirm_password: confirmPassword,
  });

  return {
    message:
      response?.message || 'Registrasi berhasil. Cek email untuk verifikasi.',
    requiresEmailVerification: response?.pending_email_verification ?? true,
    email,
  };
}

export async function loginFlow({ email, password }) {
  await loginWithEmail({ email, password });

  return exchangeWithActivationFallback(false);
}

export async function resendVerificationFlow() {
  const idToken = await getFirebaseIdToken(true);

  try {
    return await requestBackendEmailVerification(idToken);
  } catch {
    await sendVerificationEmail();
    return { message: 'Email verifikasi berhasil dikirim ulang' };
  }
}

export async function forgotPasswordFlow(email) {
  try {
    return await requestBackendPasswordReset(email);
  } catch {
    await sendResetPasswordEmail(email);
    return { message: 'Email reset password berhasil dikirim' };
  }
}

export async function exchangeFirebaseTokenForSession(forceRefresh = false) {
  return exchangeWithActivationFallback(forceRefresh);
}

export async function logoutFlow() {
  clearAuthStorage();
  await logoutFirebase();
}
