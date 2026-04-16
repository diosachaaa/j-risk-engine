import { Outlet, useLocation } from 'react-router-dom'

import AppTopbar from '../../../../shared/components/AppTopbar'
import DashboardTopbar from './DashboardTopbar'
import DashboardFooter from './DashboardFooter'
import { getRouteMeta } from '../../../../app/routeMeta'
import dashboardText from '../dashboardText'
import { useLanguage } from '../../../../shared/contexts/useLanguage'

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
      <AppTopbar />
      <DashboardTopbar title={pageTitle} />

      <main className="dashboard-main">
        <Outlet />
      </main>

      <DashboardFooter />
    </div>
  )
}