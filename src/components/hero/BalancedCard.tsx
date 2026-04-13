import { useEffect, useState } from 'react'
import { transactionsData } from '../../data/mockData'
import { TrendingUp, Eye, EyeOff, Wallet } from 'lucide-react'

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

  const monthlyGrowth = 12.5
  const thisMonthSpending = 2847

  return (
    <div className="glass-card rounded-3xl p-8 hover-lift border-0 relative overflow-hidden group">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-float opacity-70" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-float opacity-70" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        {/* Header with icon and visibility toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Wallet size={28} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Your Account</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">Primary Wallet</p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-3 bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label={isVisible ? 'Hide balance' : 'Show balance'}
          >
            {isVisible ? (
              <Eye size={20} className="text-primary-600 dark:text-primary-400" />
            ) : (
              <EyeOff size={20} className="text-primary-600 dark:text-primary-400" />
            )}
          </button>
        </div>

        {/* Main balance display */}
        <div className="mb-8 space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Total Balance</p>
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white animate-counter">
            {formatBalance(displayBalance)}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Updated just now</p>
          </div>
        </div>

        {/* Growth indicator */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200/50 dark:border-green-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                +{monthlyGrowth}% this month
              </span>
            </div>
            <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Growth</span>
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-dark-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mb-2">This Month</p>
            <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
              +${thisMonthSpending.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mb-2">Available</p>
            <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              {formatBalance(displayBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard