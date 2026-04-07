import { pricingData } from '../../data/mockData'
import { Check } from 'lucide-react'
import Button from '../common/Button'
import { useModal } from '../../hooks/useModal'
import SignupModal from '../auth/SignupModal'
import { useState } from 'react'

interface Plan {
  id: string
  name: string
  price: string | number
  period: string
  description: string
  features: string[]
  cta: string
  popular: boolean
}

interface PlanCardProps {
  plan: Plan
  onSelect: (plan: Plan) => void
}

const PlanCard = ({ plan, onSelect }: PlanCardProps) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
        plan.popular ? 'ring-2 ring-purple-500 relative' : ''
      }`}
    >
      {plan.popular && (
        <div className="gradient-bg text-white text-center py-2 text-sm font-semibold">
          Most Popular
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

        <div className="mb-6">
          {typeof plan.price === 'number' ? (
            <>
              <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600">/{plan.period}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-600">
              <Check size={18} className="text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.popular ? 'primary' : 'secondary'}
          className="w-full"
          onClick={() => onSelect(plan)}
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  )
}

const PricingCards = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const { isOpen, open, close } = useModal()

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    open()
  }

  return (
    <>
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plans that scale with you
            </h2>
            <p className="text-lg text-gray-600">
              Choose the perfect tier for your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingData.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSelect={handlePlanSelect} />
            ))}
          </div>
        </div>
      </section>

      <SignupModal isOpen={isOpen} onClose={close} preselectedPlan={selectedPlan} />
    </>
  )
}

export default PricingCards