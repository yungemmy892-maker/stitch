import { useState } from 'react'
import { featuresData } from '../../data/mockData'
import { Brain, Shield, Headphones, CreditCard } from 'lucide-react'
import Drawer from '../common/Drawer'
import useAppStore from '../../contexts/AppContext'

const iconMap = {
  Brain,
  Shield,
  Headphones,
  CreditCard,
}

const FeatureCard = ({ feature, onAIClick }) => {
  const { cardFrozen, toggleCardFreeze } = useAppStore()
  const Icon = iconMap[feature.icon]

  const handleClick = () => {
    if (feature.title === 'AI Spending Insight') {
      onAIClick()
    } else if (feature.title === 'Freeze Card Instantly') {
      toggleCardFreeze()
    }
  }

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:-translate-y-2"
      onClick={handleClick}
    >
      <div
        className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}
      >
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600 mb-4">{feature.description}</p>

      {feature.title === 'Freeze Card Instantly' && (
        <div className="mt-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              cardFrozen
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {cardFrozen ? '❄️ Card Frozen' : '✅ Card Active'}
          </span>
        </div>
      )}

      <div className="mt-4 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition">
        Click to{' '}
        {feature.title === 'AI Spending Insight'
          ? 'view insights'
          : feature.title === 'Freeze Card Instantly'
          ? cardFrozen
            ? 'unfreeze'
            : 'freeze'
          : 'learn more'}{' '}
        →
      </div>
    </div>
  )
}

const FeaturesGrid = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const aiInsightContent = (
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">Monthly Spending Summary</h3>
        <p className="text-gray-600">You spent 12% less this month compared to last month.</p>
      </div>
      <div className="p-4 bg-blue-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">Saving Opportunity</h3>
        <p className="text-gray-600">Cancel unused subscriptions to save $45/month.</p>
      </div>
      <div className="p-4 bg-green-50 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-2">Top Category</h3>
        <p className="text-gray-600">Your highest spending is on Shopping ($472.51).</p>
      </div>
    </div>
  )

  return (
    <>
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Precision Financial Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience a banking suite designed for speed, security, and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresData.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onAIClick={() => setIsDrawerOpen(true)}
              />
            ))}
          </div>
        </div>
      </section>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="AI Spending Insights"
      >
        {aiInsightContent}
      </Drawer>
    </>
  )
}

export default FeaturesGrid