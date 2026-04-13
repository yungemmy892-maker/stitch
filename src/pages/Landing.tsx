import Hero from '../components/hero/Hero'
import FeaturesGrid from '../components/features/FeaturesGrid'
import OnboardingFlow from '../components/onboarding/OnboardingFlow'
import PricingCards from '../components/pricing/PricingCards'

const Landing = () => {
  return (
    <div className="space-y-24 md:space-y-32">
      <Hero />
      <FeaturesGrid />
      <OnboardingFlow />
      <PricingCards />
    </div>
  )
}

export default Landing