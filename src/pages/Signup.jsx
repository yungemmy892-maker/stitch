import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { handleApiError } from '@/services/apiServices'
import { sanitizer, passwordManager } from '@/utils/security'
import Button from '@/components/common/Button'
import ThemeToggle from '@/components/common/ThemeToggle'
import toast from 'react-hot-toast'

/**
 * Professional Fintech Signup Page
 * Modern registration with password strength validation and security
 */
export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [passwordStrength, setPasswordStrength] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handlePasswordChange = (password) => {
    const strength = passwordManager.validate(password)
    setPasswordStrength(strength)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'password') {
      handlePasswordChange(value)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate inputs
      if (!formData.name || formData.name.trim().length < 2) {
        throw new Error('Please enter a valid name')
      }

      if (!sanitizer.validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Check password strength
      const strength = passwordManager.validate(formData.password)
      if (!strength.passes) {
        throw new Error(`Password is too weak: ${strength.feedback.join(', ')}`)
      }

      if (!agreedToTerms) {
        throw new Error('Please agree to the Terms of Service and Privacy Policy')
      }

      // Sanitize inputs
      const sanitizedName = sanitizer.sanitizeHtml(formData.name)
      const sanitizedEmail = sanitizer.sanitizeHtml(formData.email)

      // Attempt signup
      const response = await authService.signup({
        name: sanitizedName,
        email: sanitizedEmail.toLowerCase(),
        password: formData.password,
      })

      toast.success(`Welcome ${response.user.name}! Account created successfully.`)
      navigate('/demo')
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      toast.error(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (!passwordStrength) return 'gray'
    const colors = ['red', 'orange', 'yellow', 'lime', 'green']
    return colors[Math.min(passwordStrength.score, 4)]
  }

  const getStrengthLabel = () => {
    if (!passwordStrength) return ''
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    return labels[Math.min(passwordStrength.score, 4)]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center px-4 py-12">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L9 4.414V16a1 1 0 102 0V4.414l5.293 5.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join millions using Stitch for smarter money management
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-sm text-danger-800 dark:text-danger-200 flex items-start">
                <span className="mr-2 flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition"
                required
              />
            </div>

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
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition"
                required
              />

              {/* Password Strength Indicator */}
              {passwordStrength && formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Password Strength
                    </span>
                    <span
                      className={`text-xs font-semibold text-${getStrengthColor()}-600 dark:text-${getStrengthColor()}-400`}
                    >
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${getStrengthColor()}-500 transition-all duration-300`}
                      style={{
                        width: `${((passwordStrength.score + 1) / 5) * 100}%`,
                      }}
                    />
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {passwordStrength.feedback.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition"
                required
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Sign in
            </button>
          </p>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-xs text-primary-800 dark:text-primary-200 flex items-start">
              <span className="mr-2 flex-shrink-0">🔒</span>
              <span>
                Your data is encrypted end-to-end and stored securely. We never
                share your information with third parties.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
