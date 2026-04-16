import dashboardText from '../dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

export default function DashboardFooter() {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-bottom">
        <div className="dashboard-footer-links">
          <a href="#dashboard-top">{t.footer.privacyPolicy}</a>
          <span>|</span>
          <a href="#dashboard-top">{t.footer.termsOfUse}</a>
        </div>

        <p>{t.footer.copyright}</p>
      </div>
    </footer>
  )
}