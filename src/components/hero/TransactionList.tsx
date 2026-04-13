import { transactionsData } from '../../data/mockData'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

const TransactionList = () => {
  const recentTransactions = transactionsData.slice(0, 4)
  const totalIncome = transactionsData
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
  const totalExpense = transactionsData
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Salary': 'from-emerald-500 to-green-600',
      'Shopping': 'from-purple-500 to-pink-600',
      'Food': 'from-orange-500 to-red-600',
      'Transfer': 'from-blue-500 to-cyan-600',
      'Utilities': 'from-yellow-500 to-orange-600',
      'Entertainment': 'from-indigo-500 to-purple-600',
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden hover-lift border-0 flex flex-col h-full">
      {/* Header with stats */}
      <div className="p-6 border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-dark-800/50 dark:to-dark-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-xl">Activity Summary</h3>
          <TrendingUp className="text-primary-600 dark:text-primary-400" size={24} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-800/50 rounded-xl p-3 border border-green-200/50 dark:border-green-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Income</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-dark-800/50 rounded-xl p-3 border border-red-200/50 dark:border-red-900/30">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Spent</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">${totalExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {recentTransactions.map((tx, index) => (
          <div
            key={tx.id}
            className="group p-4 rounded-xl bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-dark-800/30 dark:to-dark-800/50 hover:from-white hover:to-blue-50/50 dark:hover:from-dark-800/60 dark:hover:to-dark-700/60 border border-gray-100/50 dark:border-gray-700/30 transition-all duration-300 cursor-pointer hover:shadow-lg"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl bg-gradient-to-br ${getCategoryColor(
                    tx.category
                  )} shadow-lg transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
                >
                  {tx.amount > 0 ? (
                    <ArrowUpRight size={18} className="text-white font-bold" />
                  ) : (
                    <ArrowDownRight size={18} className="text-white font-bold" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {tx.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tx.category}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`font-bold text-sm md:text-base ${
                    tx.amount > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-primary-50/30 to-blue-50/30 dark:from-dark-800/20 dark:to-dark-900/20">
        <button className="w-full py-2.5 text-center text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm">
          View All Transactions →
        </button>
      </div>
    </div>
  )
}

export default TransactionList