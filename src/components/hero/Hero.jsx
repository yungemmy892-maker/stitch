import Button from '../common/Button'
import BalanceCard from './BalancedCard'
import TransactionList from './TransactionList'
import { useModal } from '../../hooks/useModal'
import AuthModal from '../auth/AuthModal'
import { Sparkles, ArrowRight, Shield, Zap, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const { isOpen, open, close } = useModal()
  const navigate = useNavigate()

  return (
    <>
      <section className="relative pt-16 md:pt-24 pb-16 overflow-hidden">
        {/* Background Elements - Dark Mode Aware */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-dark-900 dark:via-dark-800/50 dark:to-dark-900 transition-colors duration-300" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-dark-800/60 backdrop-blur-md rounded-full border border-primary-200/50 dark:border-primary-700/50 shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trusted by 2M+ users worldwide
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white transition-colors">
                Your Money.
                <br />
                <span className="gradient-text animate-gradient-shift">No Middlemen.</span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">No Delays.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed transition-colors">
                Send, receive, and grow your finances with military-grade security and zero fees.
                Join the future of global banking in minutes.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 transition-colors">
                  <Lock className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 transition-colors">
                  <Zap className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0" />
                  <span>Instant transfers</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="group shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Open an Account
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/demo')}
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-dark-700 transition-all"
                >
                  View Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    99.99%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    $0
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    24/7
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>

            <div className="space-y-8 animate-slide-in-right">
              <div className="relative">
                <BalanceCard />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-success-500 dark:bg-success-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <TransactionList />
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isOpen} onClose={close} />
    </>
  )
}

export default Hero