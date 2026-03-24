import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Search, Equal, MapPin, Phone, Share2, ChevronUp, MessageCircleMore, Mail, ClipboardPenLine } from 'lucide-react'
import AuthTopbar from '../../components/auth/AuthTopbar'
import { useLanguage } from '../../context/LanguageContext'
import { landingText } from '../../locales/landingText'
import logoBankJatim from '../../assets/images/logo-bankjatim.png'
import dashboardPrev1 from '../../assets/images/Dashboard-prev1.png'
import dashboardPrev2 from '../../assets/images/Dashboard-prev2.png'

const socialIcons = {
  Facebook,
  Instagram,
  Threads: Equal,
  Tiktok: MessageCircleMore,
  Youtube,
}

const sideActions = [Search, Equal, MapPin, Phone, Share2]

export default function LandingPage() {
  const { language } = useLanguage()
  const text = landingText[language]

  return (
    <div className="landing-page">
      <AuthTopbar />

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

      <main className="landing-main">
        <section id="home" className="landing-hero section-shell">
          <div className="landing-hero-rings" aria-hidden="true">
            <svg
              className="landing-hero-rings-svg"
              viewBox="0 0 1440 620"
              preserveAspectRatio="xMidYMid slice"
            >
              <circle className="hero-ring" cx="720" cy="90" r="290" />
              <circle className="hero-ring" cx="720" cy="90" r="460" />
              <circle className="hero-ring" cx="720" cy="90" r="630" />
            </svg>
          </div>

          <div className="landing-section-content landing-hero-content">
            <h1>{text.hero.title}</h1>
            <h2>{text.hero.subtitle}</h2>
            <p>{text.hero.description}</p>

            <div className="landing-hero-actions">
              <Link to="/auth/login" className="landing-button landing-button-primary">
                {text.hero.login}
              </Link>
              <Link to="/auth/register" className="landing-button landing-button-secondary">
                {text.hero.register}
              </Link>
            </div>
          </div>
        </section>

        <div className="landing-section-spacer" />

        <section id="features" className="landing-features section-shell">
          <div className="landing-section-content">
            <div className="landing-section-heading">
              <h2>{text.features.title}</h2>
              <div className="landing-divider" />
            </div>

            <div className="landing-feature-grid">
              {text.features.items.map((item) => (
                <article key={item.title} className="landing-feature-card">
                  <h3>{item.title}</h3>
                  <span className="landing-card-line" />
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="landing-section-spacer" />

        <section id="dashboard-preview" className="landing-preview">
          <div className="landing-section-content landing-preview-content">
            <div className="landing-preview-visual">
              <img
                src={dashboardPrev1}
                alt="Dashboard preview main"
                className="landing-preview-image landing-preview-image-main"
              />
              <img
                src={dashboardPrev2}
                alt="Dashboard preview detail"
                className="landing-preview-image landing-preview-image-secondary"
              />
            </div>

            <div className="landing-preview-text">
              <h2>{text.preview.title}</h2>
              <span className="landing-section-line" />
              <p>{text.preview.paragraph1}</p>
              <p>{text.preview.paragraph2}</p>
            </div>
          </div>
        </section>

        <div className="landing-section-spacer" />

        <section id="contact" className="landing-contact section-shell">
          <div className="landing-social-strip">
            <div className="landing-social-strip-inner">
              <span>{text.footer.followUs}</span>
              <div className="landing-social-links">
                {text.footer.socials.map((item) => {
                  const Icon = socialIcons[item] || Facebook
                  return (
                    <a key={item} href="#contact">
                      <Icon size={20} strokeWidth={2} />
                      <span>{item}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="landing-section-content landing-contact-shell">
            <div className="landing-contact-grid">
              <div className="landing-contact-column landing-contact-column-left">
                <h3>{text.contact.headquartersTitle}</h3>
                {text.contact.headquarters.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              <div className="landing-contact-column landing-contact-column-right">
                <h3>{text.contact.contactTitle}</h3>
                <p className="landing-contact-description">{text.contact.description}</p>

                <div className="landing-contact-actions">
                  {text.contact.actions.map((action) => {
                    const icons = {
                      phone: Phone,
                      email: Mail,
                      form: ClipboardPenLine,
                      chat: MessageCircleMore,
                    }
                    const Icon = icons[action.icon]
                    return (
                      <a key={action.label} href="#contact" className="landing-contact-action">
                        <Icon size={24} strokeWidth={2} />
                        <div>
                          <strong>{action.label}</strong>
                          <span>{action.subLabel}</span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="landing-footer-bottom">
              <div className="landing-footer-links-inline">
                <a href="#contact">{text.footer.privacyPolicy}</a>
                <span>|</span>
                <a href="#contact">{text.footer.termOfUse}</a>
              </div>

              <div className="landing-footer-meta">
                <p>{text.footer.copyright}</p>
                <div className="landing-footer-badges">
                  <span>bpd</span>
                  <span>Edukasi Masyarakat</span>
                  <span>Ayo ke Bank</span>
                  <span>IB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-side-toolbar" aria-hidden="true">
            {sideActions.map((Icon, index) => (
              <button key={index} type="button">
                <Icon size={18} strokeWidth={2} />
              </button>
            ))}
            <div className="landing-side-spacer" />
            <button type="button" className="landing-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <ChevronUp size={20} strokeWidth={2.5} />
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
