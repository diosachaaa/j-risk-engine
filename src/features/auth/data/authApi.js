import axios from 'axios';
import { authConfig } from '../constants/authConfig';

const authClient = axios.create({
  baseURL: authConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export async function registerWithBackend(payload) {
  const { data } = await authClient.post('/auth/firebase/register', payload);
  return data;
}

export async function signInWithBackend(idToken) {
  const { data } = await authClient.post('/auth/firebase/sign-in', {
    id_token: idToken,
  });

  return data;
}

export async function requestBackendEmailVerification(idToken) {
  const { data } = await authClient.post(
    '/auth/firebase/send-email-verification',
    {
      id_token: idToken,
    },
  );

  return data;
}

export async function requestBackendPasswordReset(email) {
  const { data } = await authClient.post('/auth/firebase/password-reset', {
    email,
  });

  return data;
}

export { authClient };
