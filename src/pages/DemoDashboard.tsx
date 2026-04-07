import { useEffect, type ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../contexts/AppContext'
import { transactionsData } from '../data/mockData'
import { CreditCard, TrendingUp, Shield, Award } from 'lucide-react'
import Button from '../components/common/Button'

interface DashboardCardProps {
  title: string
  value: string
  icon: ComponentType<{ size?: number; className?: string }>
  color: string
}

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  category: string
  type: string
}

interface TransactionRowProps {
  transaction: Transaction
}

type AppStoreState = {
  isAuthenticated: boolean
  user: { name?: string; plan?: string } | null
  cardFrozen: boolean
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
}

const DashboardCard = ({ title, value, icon: Icon, color }: DashboardCardProps) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className={`p-2 ${color} rounded-lg`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
)

const TransactionRow = ({ transaction }: TransactionRowProps) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="font-medium text-gray-900">{transaction.description}</p>
      <p className="text-xs text-gray-500">{transaction.date}</p>
    </div>
    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
    </p>
  </div>
)

const DemoDashboard = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, cardFrozen, transactions, setTransactions } = useAppStore() as AppStoreState

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    setTransactions(transactionsData)
  }, [isAuthenticated, navigate, setTransactions])

  if (!isAuthenticated) return null

  const totalBalance = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const monthlySpending = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  const handleSendMoney = () => {
    // TODO: wire up the actual send-money flow
  }

  const handleRequestMoney = () => {
    // TODO: wire up the actual request-money flow
  }

  const handleViewStatements = () => {
    // TODO: wire up the actual statements flow
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">Here's your financial overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-gradient-to-r from-blue-500 to-cyan-500"
        />
        <DashboardCard
          title="Monthly Spending"
          value={`$${monthlySpending.toLocaleString()}`}
          icon={CreditCard}
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <DashboardCard
          title="Card Status"
          value={cardFrozen ? 'Frozen' : 'Active'}
          icon={Shield}
          color={cardFrozen ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}
        />
        <DashboardCard
          title="Account Tier"
          value={user?.plan || 'Basic'}
          icon={Award}
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="max-h-96 overflow-y-auto">
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Button variant="primary" className="w-full" onClick={handleSendMoney}>
              Send Money
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleRequestMoney}>
              Request Money
            </Button>
            <Button variant="outline" className="w-full" onClick={handleViewStatements}>
              View Statements
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">AI Insight</h3>
            <p className="text-sm text-gray-600">
              You're saving 15% more this month. Great job! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoDashboard