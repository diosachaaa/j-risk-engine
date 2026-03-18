import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { authText } from '../../locales/authText'

export default function VerifyEmailPage() {
  const { language } = useLanguage()
  const t = authText[language].verifyEmail

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <p className="auth-description">
        {t.emailMessage}
        <br />
        {t.description}
      </p>

      <button type="button" className="auth-button">
        {t.submit}
      </button>

      <p className="auth-footer-text">
        {t.resendText}{' '}
        <Link to="/auth/verify-email" className="auth-link auth-link-strong">
          {t.resend}
        </Link>
      </p>
    </div>
  )
}