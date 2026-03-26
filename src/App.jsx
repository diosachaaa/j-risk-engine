import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing/LandingPage'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import VerifyCodePage from './pages/Auth/VerifyCodePage'
import VerifyEmailPage from './pages/Auth/VerifyEmailPage'
import DashboardLayout from './layouts/dashboard/DashboardLayout'
import CISODashboardPage from './pages/Dashboard/CISO/CISODashboardPage'
import AssetDetailPage from './pages/Dashboard/CISO/AssetDetailPage'
import ManagementDashboardPage from './pages/Dashboard/Management/ManagementDashboardPage'

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
