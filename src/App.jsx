import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import VerifyCodePage from './pages/Auth/VerifyCodePage'
import VerifyEmailPage from './pages/Auth/VerifyEmailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-code" element={<VerifyCodePage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
      </Route>
    </Routes>
  )
}