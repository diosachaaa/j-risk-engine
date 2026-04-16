import { useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './LanguageContextObject';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app-language') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      isIndonesian: language === 'id',
      isEnglish: language === 'en',
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
