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
import {
  saveAccessToken,
  saveSession,
  clearAuthStorage,
} from './authStorage';
import { mapBackendAuthResponse } from './authMappers';

function persistBackendSession(mappedAuth) {
  if (!mappedAuth?.session?.accessToken) {
    return mappedAuth;
  }

  saveAccessToken(mappedAuth.session.accessToken);
  saveSession(mappedAuth.session);

  return mappedAuth;
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

  const idToken = await getFirebaseIdToken();
  const response = await signInWithBackend(idToken);
  const mapped = mapBackendAuthResponse(response);

  return persistBackendSession(mapped);
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
  const idToken = await getFirebaseIdToken(forceRefresh);
  const response = await signInWithBackend(idToken);
  const mapped = mapBackendAuthResponse(response);

  return persistBackendSession(mapped);
}

export async function logoutFlow() {
  try {
    await logoutFirebase();
  } finally {
    clearAuthStorage();
  }
}
