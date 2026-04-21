import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import dashboardText from '../dashboardText';
import { useLanguage } from '../../../../shared/contexts/useLanguage';
import { useAuth } from '../../../../shared/contexts/useAuth';

export default function DashboardTopbar({ title }) {
  const navigate = useNavigate();
  const { language = 'id' } = useLanguage();
  const { session, firebaseUser, role, logout } = useAuth();
  const t = dashboardText[language] ?? dashboardText.id;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const userLabel = useMemo(() => {
    const name =
      session?.username ||
      firebaseUser?.displayName ||
      firebaseUser?.email ||
      t.topbar.user;
    const roleLabel = role || session?.role || '-';

    return `${name} - ${roleLabel}`;
  }, [
    firebaseUser?.displayName,
    firebaseUser?.email,
    role,
    session?.role,
    session?.username,
    t.topbar.user,
  ]);

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsMenuOpen(false);
      navigate('/auth/login', { replace: true });
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="dashboard-topbar" id="dashboard-top">
      <div className="dashboard-topbar-inner">
        <span className="dashboard-topbar-title">{title || t.titles.ciso}</span>

        <div className="dashboard-topbar-actions">
          <div className="dashboard-profile-menu" ref={profileMenuRef}>
            <button
              type="button"
              className="dashboard-profile-button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <span className="dashboard-profile-label">{userLabel}</span>
              <span className="dashboard-avatar" />
            </button>

            {isMenuOpen ? (
              <div className="dashboard-profile-dropdown" role="menu">
                <button
                  type="button"
                  className="dashboard-profile-dropdown-item"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  role="menuitem"
                >
                  <LogOut size={16} aria-hidden="true" />
                  <span className="dashboard-profile-dropdown-text">
                    {isLoggingOut ? t.topbar.loggingOut : t.topbar.logout}
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}