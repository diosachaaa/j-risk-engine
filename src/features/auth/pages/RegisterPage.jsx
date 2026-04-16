import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../../../shared/contexts/useLanguage';
import { useAuth } from '../../../shared/contexts/useAuth';
import { authText } from '../locales/authText';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { language = 'id' } = useLanguage();
  const { register, loadingAuth, authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CISO',
  });
  const [localError, setLocalError] = useState('');

  const locale = authText[language] ?? authText.id;
  const t = locale.register;

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError('');

    if (form.password !== form.confirmPassword) {
      setLocalError('Konfirmasi password tidak sama');
      return;
    }

    if (form.password.length < 6) {
      setLocalError('Password minimal 6 karakter');
      return;
    }

    try {
      const result = await register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      navigate('/auth/verify-email', {
        replace: true,
        state: {
          email: form.email.trim(),
          isFromRegister: true,
          infoMessage:
            result?.message ||
            'Registrasi berhasil. Cek email untuk verifikasi akun.',
        },
      });
    } catch (error) {
      setLocalError(error?.message || 'Register gagal');
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">{t.title}</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="name">
            {t.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            className="auth-input"
            placeholder={t.namePlaceholder}
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="username">
            {t.usernameLabel}
          </label>
          <input
            id="username"
            type="text"
            className="auth-input"
            placeholder={t.usernamePlaceholder}
            value={form.username}
            onChange={(event) => setField('username', event.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            {t.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder={t.emailPlaceholder}
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            className="auth-input"
            value={form.role}
            onChange={(event) => setField('role', event.target.value)}
            required
          >
            <option value="CISO">CISO</option>
            <option value="Manajemen">Manajemen</option>
          </select>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">
            {t.passwordLabel}
          </label>

          <div className="auth-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder={t.passwordPlaceholder}
              value={form.password}
              onChange={(event) => setField('password', event.target.value)}
              required
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? t.hide : t.show}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="confirmPassword">
            {t.confirmPasswordLabel}
          </label>

          <div className="auth-input-wrap">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder={t.confirmPasswordPlaceholder}
              value={form.confirmPassword}
              onChange={(event) =>
                setField('confirmPassword', event.target.value)
              }
              required
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? t.hide : t.show}
            </button>
          </div>
        </div>

        {localError || authError ? (
          <p className="auth-error-text">{localError || authError}</p>
        ) : null}

        <button type="submit" className="auth-button" disabled={loadingAuth}>
          {loadingAuth ? 'Memproses...' : t.submit}
        </button>
      </form>

      <p className="auth-footer-text">
        {t.haveAccount}{' '}
        <Link to="/auth/login" className="auth-link auth-link-strong">
          {t.loginLink}
        </Link>
      </p>
    </div>
  );
}
