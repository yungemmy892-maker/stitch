import React, { useRef, useEffect } from 'react'
import { ariaLabels, keyboardNav, focusManager } from '../../utils/accessibility'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  ariaExpanded,
  title,
  ...props
}) => {
  const buttonRef = useRef(null)

  // Announce loading state to screen readers
  useEffect(() => {
    if (isLoading && buttonRef.current) {
      focusManager.announce(`${children} is loading`)
    }
  }, [isLoading, children])

  // Handle keyboard activation
  const handleKeyDown = (e) => {
    if (keyboardNav.isActivationKey(e)) {
      e.preventDefault()
      onClick?.(e)
    }
  }

  const variants = {
    primary: 'gradient-bg text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 shadow-md hover:shadow-lg backdrop-blur-sm',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 shadow-md hover:shadow-lg',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-lg hover:shadow-xl hover:shadow-red-500/25',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isLoading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-semibold transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        active:transform active:translate-y-0
        ${className}
      `}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
      aria-describedby={ariaDescribedBy}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-busy={isLoading}
      title={title || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3" aria-hidden="false">
          <div className="relative">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
          </div>
          <span>Loading...</span>
        </div>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
        </span>
      )}
    </button>
  )
}

export default Button