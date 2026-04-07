import Button from '../common/Button'
import BalanceCard from './BalancedCard'
import TransactionList from './TransactionList'
import { useModal } from '../../hooks/useModal'
import SignupModal from '../auth/SignupModal'
import { Sparkles, ArrowRight, Shield, Zap } from 'lucide-react'

const Hero = () => {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <section className="relative pt-16 md:pt-24 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg animate-fade-in">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Trusted by 2M+ users worldwide</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Your Money.
                <br />
                <span className="gradient-text animate-gradient-shift">No Middlemen.</span>
                <br />
                <span className="text-gray-900">No Delays.</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Send, receive, and grow your finances with military-grade security and zero fees.
                Join the future of global banking in minutes.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span>Instant transfers</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={open}
                  className="group gradient-bg-hover shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Open an Account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="glass-card hover-lift border-0 shadow-lg"
                >
                  View Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.99%</div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$0</div>
                  <div className="text-xs text-gray-500">Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-xs text-gray-500">Support</div>
                </div>
              </div>
            </div>

            <div className="space-y-8 animate-slide-in-right">
              <div className="relative">
                <BalanceCard />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <TransactionList />
            </div>
          </div>
        </div>
      </section>

      <SignupModal isOpen={isOpen} onClose={close} />
    </>
  )
}

export default Hero