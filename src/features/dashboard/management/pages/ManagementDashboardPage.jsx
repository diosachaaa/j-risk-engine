import dashboardText from '../../shared/dashboardText'
import { useLanguage } from '../../../../shared/contexts/LanguageContext'

export default function ManagementDashboardPage() {
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  return (
    <div className="dashboard-page dashboard-management-page">
      <div className="dashboard-content width-constrained">
        <section className="dashboard-panel dashboard-card">
          <div className="dashboard-card-header">
            <h2>{t.titles.management}</h2>
          </div>

          <p>{t.managementPage.placeholder}</p>
        </section>
      </div>
    </div>
  )
}