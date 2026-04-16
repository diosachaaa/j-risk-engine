import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { useAuth } from '../../../shared/contexts/AuthContext'
import { reloadFirebaseUser } from '../data/firebaseAuth'
import { authText } from '../locales/authText'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { language = 'id' } = useLanguage()
  const {
    resendVerification,
    refreshSession,
    loadingAuth,
    authError,
    firebaseUser,
    isAuthenticated,
    role,
  } = useAuth()

  const [localError, setLocalError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const locale = authText[language] ?? authText.id
  const t = locale.verifyEmail

  const email = useMemo(() => {
    return location.state?.email || firebaseUser?.email || ''
  }, [location.state, firebaseUser])

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return
    }

    if (role === 'CISO') {
      navigate('/dashboard/ciso', { replace: true })
      return
    }

    if (role === 'Manajemen') {
      navigate('/dashboard/management', { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  async function handleContinue(event) {
    event.preventDefault()
    setLocalError('')
    setInfoMessage('')

    try {
      const refreshedUser = await reloadFirebaseUser()

      if (!refreshedUser?.emailVerified) {
        setLocalError('Email belum diverifikasi. Silakan cek inbox lalu coba lagi.')
        return
      }

      const result = await refreshSession(true)

      if (!result) {
        setLocalError('Gagal membuat sesi login. Coba lagi.')
        return
      }

      if (result?.roleRequired) {
        navigate('/auth/complete-profile', {
          replace: true,
          state: { email },
        })
        return
      }

      if (result?.session?.role === 'CISO') {
        navigate('/dashboard/ciso', { replace: true })
        return
      }

      if (result?.session?.role === 'Manajemen') {
        navigate('/dashboard/management', { replace: true })
        return
      }

      setInfoMessage('Email berhasil diverifikasi.')
    } catch (error) {
      setLocalError(error?.message || 'Gagal memverifikasi email')
    }
  }

  async function handleResendEmail(event) {
    event.preventDefault()
    setLocalError('')
    setInfoMessage('')

    try {
      const result = await resendVerification()
      setInfoMessage(
        result?.message || t.resendMessage || 'Email verifikasi berhasil dikirim ulang.'
      )
    } catch (error) {
      setLocalError(error?.message || 'Gagal mengirim ulang email verifikasi')
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <p className="auth-description">
        {email ? (
          <>
            Email verifikasi telah dikirim ke <strong>{email}</strong>.
            <br />
          </>
        ) : null}
        {t.emailMessage}
        <br />
        {t.description}
      </p>

      {(localError || authError) ? (
        <p className="auth-error-text">{localError || authError}</p>
      ) : null}

      {infoMessage ? (
        <p className="auth-info-text">{infoMessage}</p>
      ) : null}

      <form onSubmit={handleContinue}>
        <button type="submit" className="auth-button" disabled={loadingAuth}>
          {loadingAuth ? 'Memproses...' : t.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {t.resendText}{' '}
        <Link
          to="/auth/verify-email"
          className="auth-link auth-link-strong"
          onClick={handleResendEmail}
        >
          {t.resend}
        </Link>
      </p>
    </div>
  )
}