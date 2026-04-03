import { Link } from 'react-router-dom'

export default function LandingHero({ text }) {
  return (
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
          <Link
            to="/auth/login"
            className="landing-button landing-button-primary"
          >
            {text.hero.login}
          </Link>

          <Link
            to="/auth/register"
            className="landing-button landing-button-secondary"
          >
            {text.hero.register}
          </Link>
        </div>
      </div>
    </section>
  )
}