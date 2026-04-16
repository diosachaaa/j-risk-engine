import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { useAuth } from '../../../shared/contexts/AuthContext'
import { authText } from '../locales/authText'

export default function LoginPage() {
  const navigate = useNavigate()
  const { language = 'id' } = useLanguage()
  const {
    login,
    forgotPassword,
    loadingAuth,
    authError,
    isAuthenticated,
    role,
  } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [localError, setLocalError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const locale = authText[language] ?? authText.id
  const t = locale.login

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

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLocalError('')
    setInfoMessage('')

    try {
      const result = await login({
        email: form.email.trim(),
        password: form.password,
      })

      if (!result?.emailVerified) {
        navigate('/auth/verify-email', {
          replace: true,
          state: { email: form.email.trim() },
        })
        return
      }

      if (result?.roleRequired) {
        navigate('/auth/complete-profile', {
          replace: true,
          state: { email: form.email.trim() },
        })
        return
      }

      if (result?.session?.role === 'CISO') {
        navigate('/dashboard/ciso', { replace: true })
        return
      }

      if (result?.session?.role === 'Manajemen') {
        navigate('/dashboard/management', { replace: true })
      }
    } catch (error) {
      setLocalError(error?.message || 'Login gagal')
    }
  }

  async function handleForgotPassword(event) {
    event.preventDefault()
    setLocalError('')
    setInfoMessage('')

    if (!form.email.trim()) {
      setLocalError('Masukkan email terlebih dahulu')
      return
    }

    try {
      const result = await forgotPassword(form.email.trim())
      setInfoMessage(result?.message || 'Email reset password berhasil dikirim')
    } catch (error) {
      setLocalError(error?.message || 'Gagal mengirim email reset password')
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            {t.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder={t.emailPlaceholder}
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">
            {t.passwordLabel}
          </label>

          <div className="auth-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder={t.passwordPlaceholder}
              value={form.password}
              onChange={(event) => setField('password', event.target.value)}
              required
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? t.hide : t.show}
            </button>
          </div>
        </div>

        <div className="auth-row">
          <label className="auth-checkbox" htmlFor="rememberMe">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
            />
            <span>{t.rememberMe}</span>
          </label>

          <a
            href="#forgot-password"
            className="auth-link"
            onClick={handleForgotPassword}
          >
            {t.forgotPassword}
          </a>
        </div>

        {(localError || authError) ? (
          <p className="auth-error-text">{localError || authError}</p>
        ) : null}

        {infoMessage ? (
          <p className="auth-info-text">{infoMessage}</p>
        ) : null}

        <button type="submit" className="auth-button" disabled={loadingAuth}>
          {loadingAuth ? 'Memproses...' : t.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {t.noAccount}{' '}
        <Link to="/auth/register" className="auth-link auth-link-strong">
          {t.registerLink}
        </Link>
      </p>
    </div>
  )
}