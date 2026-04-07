import { type ComponentType } from 'react'
import { statsData } from '../../data/mockData'
import { Users, Shield, DollarSign, Globe } from 'lucide-react'
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
}

const iconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Users,
  Shield,
  DollarSign,
  Globe,
}

const StatCard = ({ stat }: StatCardProps) => {
  const { count, ref } = useCountUp(stat.value, 1000)
  const Icon = iconMap[stat.icon]

  return (
    <div
      ref={ref}
      className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
    >
      <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-white" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900">
        {stat.prefix}
        {count.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="text-gray-600 mt-2">{stat.label}</div>
    </div>
  )
}

const StatsGrid = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsGrid