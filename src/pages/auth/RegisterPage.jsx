import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { authText } from '../../locales/authText'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { language = 'id' } = useLanguage()
  const locale = authText[language] ?? authText.id
  const t = locale.register

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/auth/verify-email')
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="name">
            {t.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            className="auth-input"
            placeholder={t.namePlaceholder}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="username">
            {t.usernameLabel}
          </label>
          <input
            id="username"
            type="text"
            className="auth-input"
            placeholder={t.usernamePlaceholder}
            required
          />
        </div>

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

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmPassword">
            {t.confirmPasswordLabel}
          </label>

          <div className="auth-input-wrap">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder={t.confirmPasswordPlaceholder}
              required
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
        {t.haveAccount}{' '}
        <Link to="/auth/login" className="auth-link auth-link-strong">
          {t.loginLink}
        </Link>
      </p>
    </div>
  )
}