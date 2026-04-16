export function mapBackendSession(session) {
  if (!session) {
    return null
  }

  return {
    accessToken: session.access_token ?? null,
    tokenType: session.token_type ?? 'Bearer',
    expiresIn: session.expires_in ?? null,
    role: session.role ?? null,
    username: session.username ?? null,
    email: session.email ?? null,
  }
}

export function mapBackendAuthResponse(payload) {
  return {
    message: payload?.message ?? '',
    emailVerified: Boolean(payload?.email_verified),
    accountActivated: Boolean(payload?.account_activated),
    session: mapBackendSession(payload?.session),
  }
}