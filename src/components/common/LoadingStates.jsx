import { Zap, AlertCircle } from 'lucide-react'

/**
 * Skeleton Loader Component
 */
export const SkeletonLoader = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`${width} ${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse ${className}`} />
)

/**
 * Skeleton Card for Dashboard
 */
export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonLoader width="w-32" height="h-4" />
      <SkeletonLoader width="w-10" height="h-10" className="rounded-lg" />
    </div>
    <SkeletonLoader width="w-24" height="h-8" />
  </div>
)

/**
 * Skeleton Transaction Row
 */
export const SkeletonTransaction = () => (
  <div className="py-4 px-2 border-b border-gray-100 space-y-2">
    <SkeletonLoader width="w-48" height="h-4" />
    <SkeletonLoader width="w-20" height="h-3" />
  </div>
)

/**
 * Loading State (Dashboard Cards)
 */
export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <SkeletonLoader width="w-32" height="h-6" />
        {[...Array(5)].map((_, i) => (
          <SkeletonTransaction key={i} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <SkeletonLoader width="w-32" height="h-6" />
        {[...Array(3)].map((_, i) => (
          <SkeletonLoader key={i} width="w-full" height="h-12" className="rounded-xl" />
        ))}
      </div>
    </div>
  </div>
)

/**
 * Empty State Component
 */
export const EmptyState = ({ icon: Icon = Zap, title, description, action, actionText = 'Get Started' }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="mb-4 p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
      <Icon size={32} className="text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
    {action && (
      <button
        onClick={action}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
      >
        {actionText}
      </button>
    )}
  </div>
)

/**
 * Error State Component
 */
export const ErrorState = ({ title = 'Something went wrong', description, retry, retryText = 'Try Again' }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="mb-4 p-4 bg-red-100 rounded-full">
      <AlertCircle size={32} className="text-red-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
    {retry && (
      <button
        onClick={retry}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
      >
        {retryText}
      </button>
    )}
  </div>
)

export default {
  SkeletonLoader,
  SkeletonCard,
  SkeletonTransaction,
  DashboardSkeleton,
  EmptyState,
  ErrorState,
}
