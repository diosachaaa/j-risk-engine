import {
  Facebook,
  Instagram,
  Youtube,
  Equal,
  Phone,
  MessageCircleMore,
  Mail,
  ClipboardPenLine,
} from 'lucide-react'

const socialIcons = {
  Facebook,
  Instagram,
  Threads: Equal,
  Tiktok: MessageCircleMore,
  Youtube,
}

const contactActionIcons = {
  phone: Phone,
  email: Mail,
  form: ClipboardPenLine,
  chat: MessageCircleMore,
}

export default function LandingContact({ text }) {
  return (
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

            <div className="landing-contact-address">
              {text.contact.headquarters.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="landing-contact-column landing-contact-column-right">
            <h3>{text.contact.contactTitle}</h3>
            <p className="landing-contact-description">
              {text.contact.description}
            </p>

            <div className="landing-contact-actions">
              {text.contact.actions.map((action) => {
                const Icon = contactActionIcons[action.icon]

                return (
                  <a
                    key={`${action.icon}-${action.label}`}
                    href="#contact"
                    className="landing-contact-action"
                  >
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
          </div>
        </div>
      </div>
    </section>
  )
}