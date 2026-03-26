import { Download } from 'lucide-react'

export default function DashboardTopbar({ title = 'CISO Dashboard' }) {
  return (
    <div className="dashboard-topbar">
      <div className="dashboard-topbar-inner">
        <span className="dashboard-topbar-title">{title}</span>

        <div className="dashboard-topbar-actions">

          <button type="button" className="dashboard-profile-button">
            <span>User</span>
            <span className="dashboard-avatar" />
          </button>
        </div>
      </div>
    </div>
  )
}