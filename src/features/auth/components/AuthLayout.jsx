import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import AppTopbar from '../../../shared/components/AppTopbar';
import topPattern from '../../../assets/images/top.png';
import bottomPattern from '../../../assets/images/bottom.png';
import { getRouteMeta } from '../../../app/routeMeta';
import { useLanguage } from '../../../shared/contexts/useLanguage';
import { authText } from '../locales/authText';

export default function AuthLayout() {
  const location = useLocation();
  const { language = 'id' } = useLanguage();
  const meta = getRouteMeta(location.pathname);

  const titleMap = {
    login: authText[language]?.login?.title,
    register: authText[language]?.register?.title,
    verifyEmail: authText[language]?.verifyEmail?.title,
  };

  const pageTitle = titleMap[meta?.titleKey] ?? '';

  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | Cyber Risk Dashboard`;
    }
  }, [pageTitle]);

  return (
    <div className="auth-layout">
      <AppTopbar />

      <div className="auth-background">
        <img
          src={topPattern}
          alt=""
          aria-hidden="true"
          className="auth-pattern auth-pattern-top"
        />
        <img
          src={bottomPattern}
          alt=""
          aria-hidden="true"
          className="auth-pattern auth-pattern-bottom"
        />

        <div className="auth-content" data-page-title={pageTitle}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
