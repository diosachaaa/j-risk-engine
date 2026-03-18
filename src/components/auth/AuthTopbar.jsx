import logoBankJatim from '../../assets/images/logo-bankjatim.png'
import { useLanguage } from '../../context/LanguageContext'

export default function AuthTopbar() {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="auth-topbar">
      <div className="auth-topbar-left">
        <button
          type="button"
          className={`lang ${language === 'id' ? 'active' : ''}`}
          onClick={() => setLanguage('id')}
        >
          BAHASA
        </button>

        <span className="divider">|</span>

        <button
          type="button"
          className={`lang ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          ENGLISH
        </button>
      </div>

      <div className="auth-topbar-right">
        <img src={logoBankJatim} alt="Bank Jatim" className="auth-logo" />
      </div>
    </header>
  )
}