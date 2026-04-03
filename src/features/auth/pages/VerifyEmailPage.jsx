import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { authText } from '../locales/authText'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const { language = 'id' } = useLanguage()

  const locale = authText[language] ?? authText.id
  const t = locale.verifyEmail

  const handleContinue = (event) => {
    event.preventDefault()
    navigate('/auth/verify-code')
  }

  const handleResendEmail = (event) => {
    event.preventDefault()
    alert(t.resendMessage ?? 'Email verifikasi berhasil dikirim ulang.')
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <p className="auth-description">
        {t.emailMessage}
        <br />
        {t.description}
      </p>

      <form onSubmit={handleContinue}>
        <button type="submit" className="auth-button">
          {t.submit}
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