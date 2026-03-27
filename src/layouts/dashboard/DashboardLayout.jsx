import { Outlet, useLocation } from 'react-router-dom'
import DashboardTopbar from '../../components/dashboard/DashboardTopbar'
import DashboardFooter from '../../components/dashboard/DashboardFooter'
import { getRouteMeta } from '../../routes/routeMeta'
import dashboardText from '../../locales/dashboardText'
import { useLanguage } from '../../context/LanguageContext'

export default function DashboardLayout() {
  const location = useLocation()
  const { language = 'id' } = useLanguage()
  const t = dashboardText[language] ?? dashboardText.id

  const meta = getRouteMeta(location.pathname)

  const titleMap = {
    ciso: t.titles.ciso,
    management: t.titles.management,
    assetDetail: t.titles.assetDetail,
  }

  const pageTitle = titleMap[meta?.titleKey] ?? t.titles.ciso

  return (
    <div className="dashboard-layout">
      <DashboardTopbar title={pageTitle} />

      <main className="dashboard-main">
        <Outlet />
      </main>

      <DashboardFooter />
    </div>
  )
}