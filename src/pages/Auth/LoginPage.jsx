import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { authText } from '../../locales/authText'

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { language } = useLanguage()
  const t = authText[language].login

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/auth/verify-code')
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            {t.email}
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder={t.emailPlaceholder}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">
            {t.password}
          </label>

          <div className="auth-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder={t.passwordPlaceholder}
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

          <Link to="/auth/login" className="auth-link">
            {t.forgotPassword}
          </Link>
        </div>

        <button type="submit" className="auth-button">
          {t.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {t.noAccount}{' '}
        <Link to="/auth/register" className="auth-link auth-link-strong">
          {t.registerHere}
        </Link>
      </p>
    </div>
  )
}