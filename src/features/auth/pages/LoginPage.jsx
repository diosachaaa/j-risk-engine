import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { authText } from '../locales/authText'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { language = 'id' } = useLanguage()
  const locale = authText[language] ?? authText.id
  const t = locale.login

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/auth/verify-code')
  }

  const handleForgotPassword = (event) => {
    event.preventDefault()
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

        <button type="submit" className="auth-button">
          {t.submit}
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