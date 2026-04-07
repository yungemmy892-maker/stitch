import { transactionsData } from '../../data/mockData'
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react'

const TransactionList = () => {
  const recentTransactions = transactionsData.slice(0, 5)

  return (
    <div className="glass-card rounded-3xl overflow-hidden hover-lift border-0">
      <div className="p-6 border-b border-gray-100/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Recent Transactions</h3>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">Your latest financial activity</p>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-hide">
        {recentTransactions.map((tx, index) => (
          <div
            key={tx.id}
            className="p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 border-b border-gray-50 last:border-0 group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                    tx.amount > 0
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-green-100 shadow-lg'
                      : 'bg-gradient-to-br from-red-100 to-rose-100 shadow-red-100 shadow-lg'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <ArrowUpRight size={20} className="text-green-600" />
                  ) : (
                    <ArrowDownRight size={20} className="text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">{tx.date}</p>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold text-lg ${
                    tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {tx.amount > 0 ? 'Credit' : 'Debit'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100/50">
        <button className="w-full py-3 text-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
          View All Transactions →
        </button>
      </div>
    </div>
  )
}

export default TransactionList