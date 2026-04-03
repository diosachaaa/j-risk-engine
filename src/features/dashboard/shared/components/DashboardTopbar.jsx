import dashboardText from '../dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function DashboardTopbar({ title = 'CISO Dashboard' }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  return (
    <div className="dashboard-topbar" id="dashboard-top">
      <div className="dashboard-topbar-inner">
        <span className="dashboard-topbar-title">{title}</span>

        <div className="dashboard-topbar-actions">
          <button type="button" className="dashboard-profile-button">
            <span>{t.topbar.user}</span>
            <span className="dashboard-avatar" />
          </button>
        </div>
      </div>
    </div>
  )
}