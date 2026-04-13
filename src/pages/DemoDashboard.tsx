import { useEffect, useState, type ComponentType } from 'react'
import toast from 'react-hot-toast'
import useAppStore from '../contexts/AppContext'
import { transactionAPI } from '../services/api'
import { transactionsData } from '../data/mockData'
import { CreditCard, TrendingUp, Shield, Award } from 'lucide-react'
import Button from '../components/common/Button'
import { DashboardSkeleton, EmptyState } from '../components/common/LoadingStates'

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
  user: { name?: string; plan?: string } | null
  cardFrozen: boolean
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  error?: string | null
  setError?: (error: string | null) => void
}

const DashboardCard = ({ title, value, icon: Icon, color }: DashboardCardProps) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-scale-up">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className={`p-3 ${color} rounded-lg shadow-lg`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{value}</p>
  </div>
)

const TransactionRow = ({ transaction }: TransactionRowProps) => (
  <div className="flex items-center justify-between py-4 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div>
      <p className="font-semibold text-gray-900">{transaction.description}</p>
      <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
    </div>
    <p className={`font-bold text-lg ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
    </p>
  </div>
)

const DemoDashboard = () => {
  const { user, cardFrozen, transactions, setTransactions, error: storeError, setError } = useAppStore() as AppStoreState
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true)
        // Simulate API call - in real app, fetch from backend
        const data = await transactionAPI.getTransactions()
        setTransactions(data.length > 0 ? data : transactionsData)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to load transactions'
        setError?.(errorMsg)
        toast.error(errorMsg)
        // Still show mock data on error
        setTransactions(transactionsData)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [setTransactions, setError])

  const totalBalance = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const monthlySpending = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  const handleSendMoney = async () => {
    setActionLoading('send')
    try {
      await transactionAPI.sendMoney({
        recipientEmail: 'friend@example.com',
        amount: 50,
      })
      toast.success('💸 Money sent successfully!')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send money'
      toast.error(errorMsg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRequestMoney = async () => {
    setActionLoading('request')
    try {
      await transactionAPI.requestMoney({
        senderEmail: 'friend@example.com',
        amount: 50,
      })
      toast.success('📲 Request sent successfully!')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to request money'
      toast.error(errorMsg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewStatements = () => {
    toast.success('📊 Viewing your statements!')
  }

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="container-custom py-8 space-y-8">
      {storeError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <div className="text-red-600 mt-0.5">⚠️</div>
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error</h3>
            <p className="text-sm text-red-700">{storeError}</p>
          </div>
        </div>
      )}

      <div className="mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-lg text-gray-600">Here's your financial overview</p>
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
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 animate-scale-up">
          <h2 className="text-2xl font-bold gradient-text mb-6">Recent Transactions</h2>
          <div className="max-h-96 overflow-y-auto scrollbar-hide">
            {transactions.length > 0 ? (
              transactions.map((tx, idx) => (
                <div key={tx.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in">
                  <TransactionRow transaction={tx} />
                </div>
              ))
            ) : (
              <EmptyState
                title="No transactions yet"
                description="Your transactions will appear here"
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 animate-scale-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold gradient-text mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Button 
              variant="primary" 
              className="w-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300" 
              onClick={handleSendMoney}
              isLoading={actionLoading === 'send'}
            >
              💸 Send Money
            </Button>
            <Button 
              variant="secondary" 
              className="w-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300" 
              onClick={handleRequestMoney}
              isLoading={actionLoading === 'request'}
            >
              📲 Request Money
            </Button>
            <Button 
              variant="outline" 
              className="w-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300" 
              onClick={handleViewStatements}
            >
              📊 View Statements
            </Button>
          </div>

          <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl border border-blue-100 hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">🤖 AI Insight</h3>
              <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">Great</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              You're saving 15% more this month compared to last month. Keep it up! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoDashboard
