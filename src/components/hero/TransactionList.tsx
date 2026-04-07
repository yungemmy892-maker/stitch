import { transactionsData } from '../../data/mockData'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const TransactionList = () => {
  const recentTransactions = transactionsData.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto scrollbar-hide">
        {recentTransactions.map((tx) => (
          <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {tx.amount > 0 ? (
                    <ArrowUpRight size={16} className="text-green-600" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <p
                className={`font-semibold ${
                  tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionList