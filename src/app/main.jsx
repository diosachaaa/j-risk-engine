import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import { LanguageProvider } from '../shared/contexts/LanguageContext'
import { AuthProvider } from '../shared/contexts/AuthContext'

import '../shared/styles/app.css'
import '../features/auth/styles/auth.css'
import '../features/landing/styles/landing.css'
import '../features/dashboard/shared/styles/dashboard.css'
import '../features/asset-detail/styles/asset-detail.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)