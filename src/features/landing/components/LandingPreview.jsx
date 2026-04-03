export default function LandingPreview({
  text,
  dashboardPrev1,
  dashboardPrev2,
}) {
  return (
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
  )
}