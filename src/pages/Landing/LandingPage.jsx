import AppTopbar from '../../components/common/AppTopbar'
import LandingNavbar from '../../components/landing/LandingNavbar'
import LandingHero from '../../components/landing/LandingHero'
import LandingFeatures from '../../components/landing/LandingFeatures'
import LandingPreview from '../../components/landing/LandingPreview'
import LandingContact from '../../components/landing/LandingContact'
import { useLanguage } from '../../context/LanguageContext'
import { landingText } from '../../locales/landingText'
import dashboardPrev1 from '../../assets/images/Dashboard-prev1.png'
import dashboardPrev2 from '../../assets/images/Dashboard-prev2.png'

export default function LandingPage() {
  const { language } = useLanguage()
  const text = landingText[language]

  return (
    <div className="landing-page">
      <AppTopbar />
      <LandingNavbar text={text} />

      <main className="landing-main">
        <LandingHero text={text} />
        <div className="landing-section-spacer" />

        <LandingFeatures text={text} />
        <div className="landing-section-spacer" />

        <LandingPreview
          text={text}
          dashboardPrev1={dashboardPrev1}
          dashboardPrev2={dashboardPrev2}
        />
        <div className="landing-section-spacer" />

        <LandingContact text={text} />
      </main>
    </div>
  )
}