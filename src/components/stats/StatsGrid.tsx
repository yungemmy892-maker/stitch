import { type ComponentType } from 'react'
import { statsData } from '../../data/mockData'
import { Users, Shield, DollarSign, Globe, TrendingUp } from 'lucide-react'
import { useCountUp } from '../../hooks/useAnimation'

interface Stat {
  id: number
  value: number
  label: string
  suffix: string
  prefix?: string
  icon: string
}

interface StatCardProps {
  stat: Stat
  index: number
}

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Users,
  Shield,
  DollarSign,
  Globe,
}

const StatCard = ({ stat, index }: StatCardProps) => {
  const { count, ref } = useCountUp(stat.value, 1500)
  const Icon = iconMap[stat.icon]

  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
  ]

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="glass-card p-8 rounded-3xl hover-lift text-center relative">
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
            <Icon size={28} className="text-white" />
          </div>

          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 animate-counter">
            {stat.prefix}
            {count.toLocaleString()}
            {stat.suffix}
          </div>

          <div className="text-gray-600 font-medium mb-3">{stat.label}</div>

          {/* Trend indicator for some stats */}
          {stat.id === 1 && (
            <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
              <TrendingUp size={14} />
              <span>+15% this month</span>
            </div>
          )}
          {stat.id === 3 && (
            <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
              <TrendingUp size={14} />
              <span>Always free</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const StatsGrid = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by millions worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join a growing community of users who trust Stitch for their financial needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsGrid