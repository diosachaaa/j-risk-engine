import AppTopbar from '../../../shared/components/AppTopbar'
import LandingNavbar from '../components/LandingNavbar'
import LandingHero from '../components/LandingHero'
import LandingFeatures from '../components/LandingFeatures'
import LandingPreview from '../components/LandingPreview'
import LandingContact from '../components/LandingContact'
import { useLanguage } from '../../../shared/contexts/LanguageContext'
import { landingText } from '../locales/landingText'
import dashboardPrev1 from '../../../assets/images/Dashboard-prev1.png'
import dashboardPrev2 from '../../../assets/images/Dashboard-prev2.png'

export default function LandingPage() {
  const { language = 'id' } = useLanguage()
  const text = landingText[language] ?? landingText.id

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