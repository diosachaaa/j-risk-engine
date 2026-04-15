import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RoleGuard({ allowedRoles = [] }) {
  const { initialized, loadingAuth, role, isAuthenticated } = useAuth()

  if (!initialized || loadingAuth) {
    return (
      <div className="auth-page-shell">
        <div className="auth-card">
          <p className="auth-description">Memeriksa hak akses...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(role)) {
    if (role === 'Manajemen') {
      return <Navigate to="/dashboard/management" replace />
    }

    if (role === 'CISO') {
      return <Navigate to="/dashboard/ciso" replace />
    }

    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}