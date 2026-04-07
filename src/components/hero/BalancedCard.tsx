import { useEffect, useState } from 'react'
import { transactionsData } from '../../data/mockData'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'

const BalanceCard = () => {
  const totalBalance = transactionsData.reduce((sum, tx) => sum + tx.amount, 0)
  const [displayBalance, setDisplayBalance] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let start = 0
    const duration = 1500
    const increment = totalBalance / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= totalBalance) {
        setDisplayBalance(totalBalance)
        clearInterval(timer)
      } else {
        setDisplayBalance(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [totalBalance])

  const formatBalance = (balance: number) => {
    return isVisible ? `$${balance.toLocaleString()}` : '••••••'
  }

  return (
    <div className="glass-card rounded-3xl p-8 hover-lift border-0 relative overflow-hidden group">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Balance</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp size={14} />
                <span className="font-medium">+12.5% this month</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            aria-label={isVisible ? 'Hide balance' : 'Show balance'}
          >
            {isVisible ? (
              <Eye size={20} className="text-gray-500" />
            ) : (
              <EyeOff size={20} className="text-gray-500" />
            )}
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 animate-counter mb-2">
            {formatBalance(displayBalance)}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-500">Updated just now</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100/50">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">This Month</p>
            <p className="text-lg font-semibold text-green-600">+$2,847</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Available</p>
            <p className="text-lg font-semibold text-gray-900">{formatBalance(displayBalance)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard