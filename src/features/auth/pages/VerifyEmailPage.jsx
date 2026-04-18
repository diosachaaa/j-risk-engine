import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../../shared/contexts/useLanguage';
import { useAuth } from '../../../shared/contexts/useAuth';
import { reloadFirebaseUser } from '../data/firebaseAuth';
import { authText } from '../locales/authText';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language = 'id' } = useLanguage();
  const {
    resendVerification,
    refreshSession,
    loadingAuth,
    authError,
    firebaseUser,
    isAuthenticated,
    role,
  } = useAuth();

  const [localError, setLocalError] = useState('');
  const [infoMessage, setInfoMessage] = useState(
    location.state?.infoMessage || '',
  );

  const locale = authText[language] ?? authText.id;
  const t = locale.verifyEmail;

  const email = useMemo(() => {
    return location.state?.email || firebaseUser?.email || '';
  }, [location.state, firebaseUser]);

  const isFromRegister = location.state?.isFromRegister ?? false;

  useEffect(() => {
    if (!isAuthenticated || !role) {
      return;
    }

    if (role === 'CISO') {
      navigate('/dashboard/ciso', { replace: true });
      return;
    }

    if (role === 'Manajemen') {
      navigate('/dashboard/management', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  async function handleContinue(event) {
    event.preventDefault();
    setLocalError('');
    setInfoMessage('');

    try {
      // Jika dari register flow dan belum login Firebase, arahkan ke login
      if (isFromRegister && !firebaseUser) {
        navigate('/auth/login', {
          replace: true,
          state: { email },
        });
        return;
      }

      const refreshedUser = await reloadFirebaseUser();

      if (!refreshedUser?.emailVerified) {
        setLocalError(
          'Email belum diverifikasi. Silakan cek inbox lalu coba lagi.',
        );
        return;
      }

      const result = await refreshSession(true);

      if (!result) {
        setLocalError('Gagal membuat sesi login. Coba lagi.');
        return;
      }

      if (result?.accountActivated && !result?.session) {
        navigate('/auth/login', {
          replace: true,
          state: {
            email,
            infoMessage: 'Akun berhasil diaktivasi, silakan login kembali.',
          },
        });
        return;
      }

      if (result?.session?.role === 'CISO') {
        navigate('/dashboard/ciso', { replace: true });
        return;
      }

      if (result?.session?.role === 'Manajemen') {
        navigate('/dashboard/management', { replace: true });
        return;
      }

      setInfoMessage(
        'Email berhasil diverifikasi. Silakan login untuk melanjutkan.',
      );
    } catch (error) {
      setLocalError(error?.message || 'Gagal memverifikasi email');
    }
  }

  async function handleResendEmail(event) {
    event.preventDefault();
    setLocalError('');
    setInfoMessage('');

    try {
      if (isFromRegister && !firebaseUser) {
        navigate('/auth/login', {
          replace: true,
          state: {
            email,
            infoMessage:
              'Silakan login terlebih dahulu untuk kirim ulang email verifikasi.',
          },
        });
        return;
      }

      const result = await resendVerification();
      setInfoMessage(
        result?.message ||
          t.resendMessage ||
          'Email verifikasi berhasil dikirim ulang.',
      );
    } catch (error) {
      setLocalError(error?.message || 'Gagal mengirim ulang email verifikasi');
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <p className="auth-description">
        {email ? (
          <>
            Email verifikasi telah dikirim ke <strong>{email}</strong>.
            <br />
          </>
        ) : null}
        {isFromRegister
          ? 'Klik link di email untuk memverifikasi akun. Setelah itu, kembali ke sini dan login.'
          : t.emailMessage}
        <br />
        {t.description}
      </p>

      {localError || authError ? (
        <p className="auth-error-text">{localError || authError}</p>
      ) : null}

      {infoMessage ? <p className="auth-info-text">{infoMessage}</p> : null}

      <form onSubmit={handleContinue}>
        <button type="submit" className="auth-button" disabled={loadingAuth}>
          {loadingAuth
            ? 'Memproses...'
            : isFromRegister && !firebaseUser
              ? 'Lanjutkan ke Login'
              : t.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {t.resendText}{' '}
        <Link
          to="/auth/verify-email"
          className="auth-link auth-link-strong"
          onClick={handleResendEmail}
        >
          {t.resend}
        </Link>
      </p>
    </div>
  );
}
