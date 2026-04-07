import { useEffect, useState } from 'react'
import { transactionsData } from '../../data/mockData'
import { TrendingUp } from 'lucide-react'

const BalanceCard = () => {
  const totalBalance = transactionsData.reduce((sum, tx) => sum + tx.amount, 0)
  const [displayBalance, setDisplayBalance] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1000
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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 font-medium">Total Balance</p>
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <TrendingUp size={16} />
          <span>+12.5%</span>
        </div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 animate-count-up">
        ${displayBalance.toLocaleString()}
      </h2>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">Last updated just now</p>
      </div>
    </div>
  )
}

export default BalanceCard