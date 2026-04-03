import { Link } from 'react-router-dom'

export default function LandingNavbar({ text }) {
  return (
    <nav className="landing-navbar">
      <div className="landing-navbar-inner">
        <div className="landing-nav-links">
          <a href="#home">{text.nav.home}</a>
          <a href="#features">{text.nav.features}</a>
          <a href="#dashboard-preview">{text.nav.dashboardPreview}</a>
          <a href="#contact">{text.nav.contact}</a>
        </div>

        <Link to="/auth/login" className="landing-login-link">
          {text.nav.login}
        </Link>
      </div>
    </nav>
  )
}