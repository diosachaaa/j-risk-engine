export default function LandingFeatures({ text }) {
  return (
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
  )
}