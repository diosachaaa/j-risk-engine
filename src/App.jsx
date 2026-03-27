import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage'
import AuthLayout from './layouts/auth/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VerifyCodePage from './pages/auth/VerifyCodePage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import DashboardLayout from './layouts/dashboard/DashboardLayout'
import CISODashboardPage from './pages/dashboard/ciso/CISODashboardPage'
import AssetDetailPage from './pages/dashboard/ciso/AssetDetailPage'
import ManagementDashboardPage from './pages/dashboard/management/ManagementDashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-code" element={<VerifyCodePage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="ciso" element={<CISODashboardPage />} />
        <Route path="ciso/assets/:assetId" element={<AssetDetailPage />} />
        <Route path="management" element={<ManagementDashboardPage />} />
      </Route>
    </Routes>
  )
}
