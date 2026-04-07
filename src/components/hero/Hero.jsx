import Button from '../common/Button'
import BalanceCard from './BalancedCard'
import TransactionList from './TransactionList'
import { useModal } from '../../hooks/useModal'
import SignupModal from '../auth/SignupModal'

const Hero = () => {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <section className="pt-12 md:pt-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Money.
                <br />
                <span className="gradient-text">No Middlemen.</span>
                <br />
                No Delays.
              </h1>

              <p className="text-lg text-gray-600 max-w-lg">
                Send, receive, and grow your finances with military-grade security and zero fees.
                Join the future of global banking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="primary" size="lg" onClick={open}>
                  Open an Account
                </Button>
                <Button variant="secondary" size="lg">
                  View Demo
                </Button>
              </div>
            </div>

            <div className="space-y-6 animate-slide-up">
              <BalanceCard />
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