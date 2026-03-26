import { Outlet, useLocation } from 'react-router-dom'
import AuthTopbar from '../../components/auth/AuthTopbar'
import DashboardTopbar from '../../components/dashboard/DashboardTopbar'
import DashboardFooter from '../../components/dashboard/DashboardFooter'

const titles = {
  '/dashboard/ciso': 'CISO Dashboard',
  '/dashboard/management': 'Management Dashboard',
}

export default function DashboardLayout() {
  const location = useLocation()

  const title = location.pathname.startsWith('/dashboard/ciso/assets/')
    ? 'CISO Dashboard / Detail Asset'
    : (titles[location.pathname] ?? 'Dashboard')

  return (
    <div className="dashboard-shell" id="dashboard-top">
      <AuthTopbar />

      <DashboardTopbar title={title} />

      <main className="dashboard-main">
        <Outlet />
      </main>

      <DashboardFooter />
    </div>
  )
}