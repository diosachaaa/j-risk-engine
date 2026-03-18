import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app-language') || 'id'
  })

  useEffect(() => {
    localStorage.setItem('app-language', language)
  }, [language])

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      isIndonesian: language === 'id',
      isEnglish: language === 'en',
    }
  }, [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }

  return context
}