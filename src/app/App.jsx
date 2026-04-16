import { Routes, Route } from 'react-router-dom'

import LandingPage from '../features/landing/pages/LandingPage'
import AuthLayout from '../features/auth/components/AuthLayout'
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage'
import DashboardLayout from '../features/dashboard/shared/components/DashboardLayout'
import CISODashboardPage from '../features/dashboard/ciso/pages/CISODashboardPage'
import AssetDetailPage from '../features/asset-detail/pages/AssetDetailPage'
import ManagementDashboardPage from '../features/dashboard/management/pages/ManagementDashboardPage'

import ProtectedRoute from '../shared/components/ProtectedRoute'
import RoleGuard from '../shared/components/RoleGuard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route element={<RoleGuard allowedRoles={['CISO']} />}>
            <Route path="ciso" element={<CISODashboardPage />} />
            <Route path="ciso/assets/:assetId" element={<AssetDetailPage />} />
          </Route>

          <Route element={<RoleGuard allowedRoles={['Manajemen']} />}>
            <Route path="management" element={<ManagementDashboardPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}