import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

/**
 * Error Boundary Component
 * Catches errors in child components and displays error UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Error info:', errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Log to error tracking service in production
    if (import.meta.env.VITE_ENABLE_ERROR_LOGGING === 'true') {
      // TODO: Send to Sentry or similar
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle size={40} className="text-red-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try again.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                  Error Details
                </summary>
                <div className="bg-gray-100 rounded-lg p-3 text-xs text-red-600 font-mono overflow-auto max-h-48">
                  <p className="mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-600">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
              <Button variant="primary" className="flex-1" onClick={this.handleReset}>
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
