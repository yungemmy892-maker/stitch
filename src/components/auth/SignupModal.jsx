import { useState, useId } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AlertCircle, CheckCircle } from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import useAppStore from '../../contexts/AppContext'
import { passwordManager, sanitizer } from '../../utils/security'
import { ariaLabels, screenReader } from '../../utils/accessibility'

/**
 * Enhanced SignupModal with security & accessibility
 */
const SignupModal = ({ isOpen, onClose, preselectedPlan = null }) => {
  'use no memo'
  const [isLoading, setIsLoading] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState([])
  const [passwordStrength, setPasswordStrength] = useState(false)
  
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmPasswordId = useId()
  const feedbackId = useId()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const { login, setSelectedPlan } = useAppStore()

  const password = watch('password')
  const email = watch('email')

  // Monitor password strength in real-time
  const handlePasswordChange = (value) => {
    const { isStrong, feedback } = passwordManager.isStrongPassword(value)
    setPasswordStrength(isStrong)
    setPasswordFeedback(feedback)
  }

  const onSubmit = async (data) => {
    // Sanitize inputs
    const sanitizedName = sanitizer.sanitizeHTML(data.name)
    const sanitizedEmail = sanitizer.sanitizeHTML(data.email)

    // Validate email format
    if (!sanitizer.isValidEmail(data.email)) {
      toast.error('Invalid email address')
      return
    }

    // Validate password strength
    const { isStrong } = passwordManager.isStrongPassword(data.password)
    if (!isStrong) {
      toast.error('Password does not meet security requirements')
      screenReader.announceError('password', 'Password does not meet security requirements')
      return
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      login({
        name: sanitizedName,
        email: sanitizedEmail,
        plan: preselectedPlan?.name || 'Basic',
      })

      if (preselectedPlan) {
        setSelectedPlan(preselectedPlan)
      }

      toast.success('Account created successfully! Redirecting to dashboard...')
      screenReader.announceLoading('dashboard')
      onClose()
      navigate('/demo')
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create your Account" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label
            htmlFor={nameId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id={nameId}
            type="text"
            {...register('name', { 
              required: 'Name is required',
              maxLength: { value: 100, message: 'Name must be 100 characters or less' }
            })}
            aria-label={ariaLabels.formInputLabel('Full Name', true, errors.name?.message)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            aria-invalid={!!errors.name}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
            autoComplete="name"
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor={emailId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id={emailId}
            type="email"
            {...register('email', {
              required: 'Email is required',
              validate: (value) =>
                sanitizer.isValidEmail(value) || 'Invalid email format',
            })}
            aria-label={ariaLabels.formInputLabel('Email Address', true, errors.email?.message)}
            aria-describedby={errors.email ? `${emailId}-error` : `${emailId}-hint`}
            aria-invalid={!!errors.email}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
            autoComplete="email"
          />
          {!errors.email && (
            <p id={`${emailId}-hint`} className="text-gray-500 text-xs mt-1">
              We'll use this to secure your account
            </p>
          )}
          {errors.email && (
            <p id={`${emailId}-error`} className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor={passwordId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id={passwordId}
            type="password"
            {...register('password', {
              required: 'Password is required',
              onChange: (e) => handlePasswordChange(e.target.value),
            })}
            aria-label={ariaLabels.formInputLabel('Password', true, errors.password?.message)}
            aria-describedby={passwordFeedback.length > 0 ? feedbackId : undefined}
            aria-invalid={!!errors.password}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"
            autoComplete="new-password"
          />
          
          {/* Password Strength Feedback */}
          {password && (
            <div
              id={feedbackId}
              className={`mt-2 p-2 rounded text-xs ${
                passwordStrength
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 mb-1">
                {passwordStrength ? (
                  <>
                    <CheckCircle size={14} className="text-green-600" />
                    <span className="text-green-700 font-semibold">Strong password</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="text-yellow-600" />
                    <span className="text-yellow-700 font-semibold">Password needs:</span>
                  </>
                )}
              </div>
              {!passwordStrength && (
                <ul className="space-y-1 ml-5 list-disc">
                  {passwordFeedback.map((item) => (
                    <li key={item} className="text-yellow-700">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor={confirmPasswordId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id={confirmPasswordId}
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            aria-label={ariaLabels.formInputLabel('Confirm Password', true, errors.confirmPassword?.message)}
            aria-describedby={errors.confirmPassword ? `${confirmPasswordId}-error` : undefined}
            aria-invalid={!!errors.confirmPassword}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p id={`${confirmPasswordId}-error`} className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Plan Selection Info */}
        {preselectedPlan && (
          <div 
            className="p-3 bg-blue-50 rounded-lg border border-blue-200"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-blue-800">
              You're signing up for the <strong>{preselectedPlan.name}</strong> plan.
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600">
            ðŸ”’ Your information is encrypted and secured according to industry standards.
          </p>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full" 
          isLoading={isLoading}
          ariaLabel="Create account and proceed to dashboard"
        >
          Create Account
        </Button>
      </form>
    </Modal>
  )
}

export default SignupModal
