import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { authText } from '../../locales/authText'

export default function VerifyCodePage() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = authText[language].verifyCode

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="verificationCode">
            {t.label}
          </label>
          <input
            id="verificationCode"
            type="text"
            className="auth-input"
            placeholder={t.placeholder}
          />
        </div>

        <p className="auth-description">
          {t.description}
          <br />
          {t.emailMessage}
        </p>

        <button type="submit" className="auth-button">
          {t.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {t.resendText}{' '}
        <Link to="/auth/verify-code" className="auth-link auth-link-strong">
          {t.resend}
        </Link>
      </p>
    </div>
  )
}