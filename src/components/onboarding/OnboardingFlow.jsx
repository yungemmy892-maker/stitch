import { onboardingSteps } from '../../data/mockData'
import { CheckCircle, UserPlus, CreditCard, Globe } from 'lucide-react'
import useAppStore from '../../contexts/AppContext'
import Button from '../common/Button'
import { useModal } from '../../hooks/useModal'
import SignupModal from '../auth/SignupModal'

const iconMap = {
  UserPlus,
  CreditCard,
  Globe,
}

const StepCard = ({ step, isActive, isCompleted }) => {
  const Icon = iconMap[step.icon]

  return (
    <div className="relative">
      {step.step < 3 && (
        <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2">
          <div
            className={`h-full ${
              isCompleted ? 'gradient-bg' : 'bg-gray-200'
            } transition-all duration-500`}
          />
        </div>
      )}

      <div className="text-center relative z-10">
        <div
          className={`
            w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4
            ${
              isCompleted
                ? 'gradient-bg'
                : isActive
                ? 'gradient-bg animate-pulse'
                : 'bg-gray-200'
            }
            transition-all duration-300
          `}
        >
          {isCompleted ? (
            <CheckCircle size={40} className="text-white" />
          ) : (
            <Icon size={40} className={isActive ? 'text-white' : 'text-gray-400'} />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">{step.description}</p>
      </div>
    </div>
  )
}

const OnboardingFlow = () => {
  const { isAuthenticated } = useAppStore()
  const { isOpen, open, close } = useModal()

  // Calculate completed steps based on auth status
  const completedSteps = isAuthenticated ? 1 : 0

  return (
    <>
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple. Transparent. Fast.
            </h2>
            <p className="text-lg text-gray-600">
              Get started in under a minute with our streamlined onboarding process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {onboardingSteps.map((step, index) => (
              <StepCard
                key={step.step}
                step={step}
                isActive={step.step === completedSteps + 1}
                isCompleted={step.step <= completedSteps}
              />
            ))}
          </div>

          {!isAuthenticated && (
            <div className="text-center mt-12">
              <Button variant="primary" size="lg" onClick={open}>
                Open an Account
              </Button>
            </div>
          )}
        </div>
      </section>

      <SignupModal isOpen={isOpen} onClose={close} />
    </>
  )
}

export default OnboardingFlow