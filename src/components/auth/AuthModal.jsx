import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Modal from '../common/Modal'
import Button from '../common/Button'
import useAppStore from '../../contexts/AppContext'
import { LogIn, UserPlus, AlertCircle } from 'lucide-react'
import { authAPI, APIError } from '../../services/api'

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const { login, setError: setStoreError } = useAppStore()

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setApiError(null)

    try {
      let userData

      if (isSignup) {
        userData = await authAPI.signup({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      } else {
        userData = await authAPI.login({
          email: data.email,
          password: data.password,
        })
      }

      if (!userData.email) {
        throw new Error('Invalid response from server: missing email')
      }

      login({
        name: userData.name,
        email: userData.email,
        plan: userData.plan || 'Basic',
        token: userData.token,
      })

      toast.success(isSignup ? 'Account created successfully!' : 'Logged in successfully!')
      reset()
      setIsSignup(false)
      onClose()
      navigate('/demo')
    } catch (error) {
      console.error('[AuthModal] Error:', error)

      let errorMessage = 'An unexpected error occurred'

      if (error instanceof APIError) {
        errorMessage = error.message
        console.error('[AuthModal] APIError:', errorMessage, error.status, error.code)
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      console.error('[AuthModal] Final error message:', errorMessage)
      setApiError(errorMessage)
      setStoreError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = () => {
    reset()
    setIsSignup(!isSignup)
    setApiError(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setIsSignup(false)
        reset()
        setApiError(null)
      }}
      title={isSignup ? 'Create Account' : 'Welcome Back'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', { required: isSignup ? 'Name is required' : false })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white/50 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white/50 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white/50 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {isSignup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white/50 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} disabled={isLoading}>
          <div className="flex items-center justify-center gap-2">
            {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
          </div>
        </Button>

        <div className="relative flex items-center gap-2">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-500 px-2">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isLoading}
            className="ml-1 font-semibold text-blue-600 hover:text-blue-700 transition disabled:opacity-50"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        {!isSignup && (
          <p className="text-center text-xs text-gray-500 pt-2">
            Demo: Use any email & password (min 6 chars)
          </p>
        )}
      </form>
    </Modal>
  )
}

export default AuthModal
