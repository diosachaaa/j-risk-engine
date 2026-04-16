import dashboardText from '../dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

export default function DashboardTopbar({ title }) {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  return (
    <div className="dashboard-topbar" id="dashboard-top">
      <div className="dashboard-topbar-inner">
        <span className="dashboard-topbar-title">
          {title || t.titles.ciso}
        </span>

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