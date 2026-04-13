import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '@/services/authService'
import { handleApiError } from '@/services/apiServices'
import { sanitizer, passwordManager } from '@/utils/security'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import ThemeToggle from '@/components/common/ThemeToggle'
import toast from 'react-hot-toast'

/**
 * Professional Fintech Login Page
 * Modern, clean design with dark/light theme support
 */
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!sanitizer.validateEmail(email)) {
        throw new Error('Please enter a valid email address')
      }

      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // Attempt login
      const response = await authService.login({
        email: email.toLowerCase(),
        password,
      })

      toast.success(`Welcome back, ${response.user.name}!`)

      // Redirect to dashboard or intended page
      const from = location.state?.from?.pathname || '/demo'
      navigate(from)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      toast.error(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setForgotLoading(true)

    try {
      if (!sanitizer.validateEmail(forgotEmail)) {
        throw new Error('Please enter a valid email address')
      }

      await authService.requestPasswordReset(forgotEmail)
      toast.success('Password reset link sent to your email')
      setShowForgotPassword(false)
      setForgotEmail('')
    } catch (err) {
      const apiError = handleApiError(err)
      toast.error(apiError.message)
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center px-4 py-12">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Left Side - Brand/Info */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center lg:pr-12">
        <div className="max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 4.414V16a1 1 0 102 0V4.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              Stitch
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Modern fintech platform for seamless financial management
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mt-10">
            {[
              {
                icon: '🔒',
                title: 'Bank-Level Security',
                desc: 'Military-grade encryption for your data',
              },
              {
                icon: '⚡',
                title: 'Instant Transfers',
                desc: 'Send money globally in seconds',
              },
              {
                icon: '📊',
                title: 'Smart Analytics',
                desc: 'Track spending and optimize finances',
              },
              {
                icon: '🌍',
                title: 'Global Access',
                desc: 'Manage money anytime, anywhere',
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-3">
                <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 max-w-md">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Sign in to your Stitch account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-sm text-danger-800 dark:text-danger-200 flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition"
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 text-gray-900 dark:text-white font-medium transition"
            >
              Google
            </button>
            <button
              type="button"
              className="py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 text-gray-900 dark:text-white font-medium transition"
            >
              Apple
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enter your email and we'll send you a password reset link
          </p>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              required
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={forgotLoading}
            >
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  )
}
