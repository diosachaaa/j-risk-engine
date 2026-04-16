import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute() {
  const location = useLocation()
  const {
    initialized,
    loadingAuth,
    firebaseUser,
    isEmailVerified,
    needsProfileCompletion,
    isAuthenticated,
  } = useAuth()

  if (!initialized || loadingAuth) {
    return (
      <div className="auth-page-shell">
        <div className="auth-card">
          <p className="auth-description">Memeriksa sesi login...</p>
        </div>
      </div>
    )
  }

  if (!firebaseUser) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (!isEmailVerified) {
    return (
      <Navigate
        to="/auth/verify-email"
        replace
        state={{ from: location.pathname, email: firebaseUser.email }}
      />
    )
  }

  if (needsProfileCompletion || !isAuthenticated) {
    return (
      <Navigate
        to="/auth/complete-profile"
        replace
        state={{ from: location.pathname, email: firebaseUser.email }}
      />
    )
  }

  return <Outlet />
}