import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { authText } from '../../locales/authText'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { language } = useLanguage()
  const t = authText[language].register

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/auth/verify-email')
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="fullName">
            {t.fullName}
          </label>
          <input
            id="fullName"
            type="text"
            className="auth-input"
            placeholder={t.fullNamePlaceholder}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="username">
            {t.username}
          </label>
          <input
            id="username"
            type="text"
            className="auth-input"
            placeholder={t.usernamePlaceholder}
          />
        </div>

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

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmPassword">
            {t.confirmPassword}
          </label>

          <div className="auth-input-wrap">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder={t.confirmPasswordPlaceholder}
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? t.hide : t.show}
            </button>
          </div>
        </div>

        <button type="submit" className="auth-button">
          {t.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {t.alreadyHaveAccount}{' '}
        <Link to="/auth/login" className="auth-link auth-link-strong">
          {t.login}
        </Link>
      </p>
    </div>
  )
}