import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { useAuth } from '../../../shared/contexts/AuthContext'

function getPageCopy(language) {
  if (language === 'en') {
    return {
      title: 'Complete Profile',
      description:
        'Your email has been verified. Please choose your role to complete account setup.',
      emailLabel: 'Signed in as',
      roleLabel: 'Role',
      roleHelp:
        'CISO will see detailed technical dashboards, while Management will see executive summaries.',
      submit: 'Continue',
      resendText: 'Need to go back?',
      resend: 'Back to login',
      successMessage: 'Profile completed successfully.',
    }
  }

  return {
    title: 'Lengkapi Profil',
    description:
      'Email kamu sudah diverifikasi. Pilih role untuk menyelesaikan proses login.',
    emailLabel: 'Masuk sebagai',
    roleLabel: 'Role',
    roleHelp:
      'CISO akan melihat dashboard teknis yang lebih detail, sedangkan Manajemen akan melihat ringkasan eksekutif.',
    submit: 'Lanjutkan',
    resendText: 'Ingin kembali?',
    resend: 'Kembali ke login',
    successMessage: 'Profil berhasil dilengkapi.',
  }
}

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { language = 'id' } = useLanguage()
  const {
    completeProfile,
    loadingAuth,
    authError,
    pendingRole,
    firebaseUser,
    isAuthenticated,
    role,
  } = useAuth()

  const copy = getPageCopy(language)

  const [selectedRole, setSelectedRole] = useState(
    location.state?.role || pendingRole || 'CISO'
  )
  const [localError, setLocalError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  const email = useMemo(() => {
    return location.state?.email || firebaseUser?.email || ''
  }, [location.state, firebaseUser])

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return
    }

    if (role === 'CISO') {
      navigate('/dashboard/ciso', { replace: true })
      return
    }

    if (role === 'Manajemen') {
      navigate('/dashboard/management', { replace: true })
    }
  }, [isAuthenticated, role, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setLocalError('')
    setInfoMessage('')

    try {
      const result = await completeProfile(selectedRole)
      setInfoMessage(copy.successMessage)

      if (result?.session?.role === 'CISO') {
        navigate('/dashboard/ciso', { replace: true })
        return
      }

      if (result?.session?.role === 'Manajemen') {
        navigate('/dashboard/management', { replace: true })
        return
      }

      if (selectedRole === 'CISO') {
        navigate('/dashboard/ciso', { replace: true })
        return
      }

      navigate('/dashboard/management', { replace: true })
    } catch (error) {
      setLocalError(error?.message || 'Gagal melengkapi profil')
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{copy.title}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        {email ? (
          <p className="auth-description">
            <strong>{copy.emailLabel}:</strong> {email}
          </p>
        ) : null}

        <p className="auth-description">{copy.description}</p>

        <div className="auth-field">
          <label className="auth-label" htmlFor="role">
            {copy.roleLabel}
          </label>
          <select
            id="role"
            className="auth-input"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            required
          >
            <option value="CISO">CISO</option>
            <option value="Manajemen">Manajemen</option>
          </select>
        </div>

        <p className="auth-description">{copy.roleHelp}</p>

        {(localError || authError) ? (
          <p className="auth-error-text">{localError || authError}</p>
        ) : null}

        {infoMessage ? (
          <p className="auth-info-text">{infoMessage}</p>
        ) : null}

        <button type="submit" className="auth-button" disabled={loadingAuth}>
          {loadingAuth ? 'Memproses...' : copy.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {copy.resendText}{' '}
        <Link to="/auth/login" className="auth-link auth-link-strong">
          {copy.resend}
        </Link>
      </p>
    </div>
  )
}