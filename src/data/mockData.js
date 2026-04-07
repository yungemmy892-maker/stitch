export const statsData = [
  { id: 1, value: 2000000, label: 'Active Users', suffix: '+', icon: 'Users' },
  { id: 2, value: 99.99, label: 'Total Product Uptime', suffix: '%', icon: 'Shield' },
  { id: 3, value: 0, label: 'Transaction Fees', prefix: '$', suffix: '', icon: 'DollarSign' },
  { id: 4, value: 150, label: 'Countries', suffix: '+', icon: 'Globe' },
]

export const transactionsData = [
  { id: 'tx1', description: 'Salary Deposit', amount: 4247.27, date: '2024-03-14', category: 'income', type: 'credit' },
  { id: 'tx2', description: 'Grocery Store', amount: -342.52, date: '2024-03-15', category: 'shopping', type: 'debit' },
  { id: 'tx3', description: 'Netflix Subscription', amount: -15.99, date: '2024-03-13', category: 'entertainment', type: 'debit' },
  { id: 'tx4', description: 'Uber Ride', amount: -24.50, date: '2024-03-12', category: 'transport', type: 'debit' },
  { id: 'tx5', description: 'Freelance Payment', amount: 1200.00, date: '2024-03-11', category: 'income', type: 'credit' },
  { id: 'tx6', description: 'Restaurant', amount: -67.30, date: '2024-03-10', category: 'food', type: 'debit' },
  { id: 'tx7', description: 'Amazon Purchase', amount: -129.99, date: '2024-03-09', category: 'shopping', type: 'debit' },
  { id: 'tx8', description: 'Phone Bill', amount: -85.00, date: '2024-03-08', category: 'utilities', type: 'debit' },
]

export const featuresData = [
  {
    id: 1,
    title: 'AI Spending Insight',
    description: 'Get personalized insights about your spending habits and saving opportunities.',
    icon: 'Brain',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: 'Bank-Level Encryption',
    description: 'Your data is protected with 256-bit military-grade encryption.',
    icon: 'Shield',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: '24/7 Support',
    description: 'Get help whenever you need it with our dedicated support team.',
    icon: 'Headphones',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 4,
    title: 'Freeze Card Instantly',
    description: 'Lock your card anytime to prevent unauthorized use.',
    icon: 'CreditCard',
    gradient: 'from-orange-500 to-red-500',
  },
]

export const pricingData = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    period: 'monthly',
    description: 'Simple, free plan with core features & support to get you started.',
    features: ['Free transfers', 'Personalized dashboard', '24/7 support', 'Tailored solutions'],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    period: 'monthly',
    description: 'Faster transfers and advanced tools for professionals who want more efficiency.',
    features: ['Priority transfers', 'Advanced analytics', 'Dedicated support', 'Personalized dashboard'],
    cta: 'Choose Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored, scalable solutions for large organizations.',
    features: ['API integration', 'Account manager', 'Contact Sales', 'Tailored solutions'],
    cta: 'Contact Sales',
    popular: false,
  },
]

export const onboardingSteps = [
  {
    step: 1,
    title: 'Create your Account',
    description: 'Sign up for free and verify your identity in seconds',
    icon: 'UserPlus',
  },
  {
    step: 2,
    title: 'Add your funds',
    description: 'Deposit money securely using your preferred method',
    icon: 'CreditCard',
  },
  {
    step: 3,
    title: 'Transact globally',
    description: 'Send, receive, and spend money anywhere, anytime',
    icon: 'Globe',
  },
]