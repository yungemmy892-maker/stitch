/**
 * Backend Integration Examples
 * Practical examples of how to use authService, apiClient, and apiServices
 * 
 * Copy these patterns into your components and pages
 */

// ============================================================================
// EXAMPLE 1: Login Form with authService
// ============================================================================

/*
// File: src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { authService } from '@/services/authService'
import { handleApiError } from '@/services/apiServices'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      
      // Auth successful - user is now logged in
      console.log('Welcome:', response.user.name)
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard'
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
*/

// ============================================================================
// EXAMPLE 2: Signup with Password Strength Feedback
// ============================================================================

/*
// File: src/components/auth/SignupFormWithValidation.jsx
import { useState } from 'react'
import { authService } from '@/services/authService'
import { passwordManager, sanitizer } from '@/utils/security'
import { handleApiError } from '@/services/apiServices'

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [passwordStrength, setPasswordStrength] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = (password) => {
    const strength = passwordManager.validate(password)
    setPasswordStrength(strength)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check password strength
    const strength = passwordManager.validate(formData.password)
    if (!strength.passes) {
      setError(`Password is too weak: ${strength.feedback.join(', ')}`)
      return
    }

    setLoading(true)

    try {
      // Sanitize inputs
      const sanitizedName = sanitizer.sanitizeHtml(formData.name)
      const sanitizedEmail = sanitizer.sanitizeHtml(formData.email)

      const response = await authService.signup({
        name: sanitizedName,
        email: sanitizedEmail,
        password: formData.password
      })

      console.log('Account created:', response.user.email)
      window.location.href = '/dashboard'
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Full Name"
        required
      />
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      
      <div>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value })
            handlePasswordChange(e.target.value)
          }}
          placeholder="Password"
          required
        />
        {passwordStrength && (
          <div>
            <div className={`strength strength-${passwordStrength.score}`}>
              Strength: {['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength.score]}
            </div>
            {passwordStrength.feedback.length > 0 && (
              <ul>
                {passwordStrength.feedback.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      <input
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        placeholder="Confirm Password"
        required
      />
      
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}
*/

// ============================================================================
// EXAMPLE 3: Dashboard with Transaction Data from API
// ============================================================================

/*
// File: src/pages/DashboardWithAPI.jsx
import { useEffect, useState } from 'react'
import { dashboardAPI, transactionAPI, handleApiError } from '@/services/apiServices'
import { authService } from '@/services/authService'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      
      // Get dashboard data from API
      const data = await dashboardAPI.getDashboard()
      setDashboard(data)
      
      // Get transactions separately
      const { transactions } = await transactionAPI.getTransactions(10, 0)
      setTransactions(transactions)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  if (!authService.isAuthenticated()) {
    return <div>Please log in first</div>
  }

  if (loading) return <div>Loading dashboard...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <h1>Dashboard</h1>
      
      {dashboard && (
        <div>
          <div className="account-info">
            <p>Balance: ${dashboard.account.balance}</p>
            <p>Account: {dashboard.account.accountNumber}</p>
          </div>
          
          <div className="stats">
            <p>Total In: ${dashboard.stats.totalIn}</p>
            <p>Total Out: ${dashboard.stats.totalOut}</p>
            <p>Net Change: ${dashboard.stats.netChange}</p>
          </div>
        </div>
      )}
      
      <h2>Recent Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td ${tx.type === 'debit' ? '-' : '+'}${tx.amount}</td>
              <td>{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={loadDashboard}>Refresh</button>
    </div>
  )
}
*/

// ============================================================================
// EXAMPLE 4: Account Transfer Component
// ============================================================================

/*
// File: src/components/payments/TransferForm.jsx
import { useState } from 'react'
import { accountAPI, handleApiError } from '@/services/apiServices'
import { appStore } from '@/contexts/AppContext'

export default function TransferForm() {
  const [fromAccountId, setFromAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  // Get from Zustand store
  const { addNotification } = appStore()

  const handleTransfer = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const result = await accountAPI.transfer(
        fromAccountId,
        toAccountId,
        parseFloat(amount),
        description
      )

      setSuccess(`Transfer completed! Transaction ID: ${result.transactionId}`)
      
      // Add notification
      addNotification({
        type: 'success',
        message: 'Transfer successful',
        duration: 5000
      })

      // Reset form
      setFromAccountId('')
      setToAccountId('')
      setAmount('')
      setDescription('')
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
      
      addNotification({
        type: 'error',
        message: apiError.message,
        duration: 5000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleTransfer}>
      <h2>Transfer Money</h2>
      
      <select
        value={fromAccountId}
        onChange={(e) => setFromAccountId(e.target.value)}
        required
      >
        <option value="">Select from account</option>
        {/* Load accounts from API */}
      </select>
      
      <select
        value={toAccountId}
        onChange={(e) => setToAccountId(e.target.value)}
        required
      >
        <option value="">Select to account</option>
        {/* Load accounts from API */}
      </select>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="0.01"
        min="0"
        required
      />
      
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Transfer description"
      />
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Transfer'}
      </button>
    </form>
  )
}
*/

// ============================================================================
// EXAMPLE 5: Protected Route Component
// ============================================================================

/*
// File: src/components/layout/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { authService } from '@/services/authService'

export default function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Verify token freshness
  const isValid = await authService.verifyToken()
  if (!isValid) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Usage in router:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
*/

// ============================================================================
// EXAMPLE 6: Profile Update with API
// ============================================================================

/*
// File: src/pages/ProfileSettings.jsx
import { useEffect, useState } from 'react'
import { userAPI, handleApiError } from '@/services/apiServices'
import { preferencesStore } from '@/contexts/PreferencesContext'

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { preferences, updatePreferences } = preferencesStore()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const user = await userAPI.getProfile()
      setProfile(user)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    try {
      const updated = await userAPI.updateProfile({
        name: profile.name,
        plan: profile.plan
      })
      
      setProfile(updated)
      setSuccess('Profile updated successfully')
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePreferenceChange = async (key, value) => {
    try {
      const updated = await userAPI.updatePreferences({
        ...preferences,
        [key]: value
      })
      updatePreferences(updated)
    } catch (err) {
      const apiError = handleApiError(err)
      setError(apiError.message)
    }
  }

  if (loading) return <div>Loading profile...</div>

  return (
    <div>
      <h1>Profile Settings</h1>
      
      <form onSubmit={handleProfileUpdate}>
        <input
          type="text"
          value={profile?.name || ''}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Full Name"
        />
        
        <p>Email: {profile?.email}</p>
        <p>Plan: {profile?.plan}</p>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <hr />

      <h2>Preferences</h2>
      <label>
        <input
          type="checkbox"
          checked={preferences?.emailNotifications || false}
          onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
        />
        Email Notifications
      </label>
    </div>
  )
}
*/

// ============================================================================
// EXAMPLE 7: Error Boundary with API Error Handling
// ============================================================================

/*
// File: src/components/common/APIErrorBoundary.jsx
import { Component } from 'react'
import { handleApiError } from '@/services/apiServices'

export default class APIErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorCode: null,
      retrying: false
    }
  }

  static getDerivedStateFromError(error) {
    const apiError = handleApiError(error)
    return {
      error: apiError.message,
      errorCode: apiError.code
    }
  }

  handleRetry = async () => {
    this.setState({ retrying: true })
    try {
      // Retry the operation
      window.location.reload()
    } finally {
      this.setState({ retrying: false })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error}</p>
          <p>Error Code: {this.state.errorCode}</p>
          <button 
            onClick={this.handleRetry}
            disabled={this.state.retrying}
          >
            {this.state.retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
*/

// ============================================================================
// EXAMPLE 8: Real-time Balance Updates with Polling
// ============================================================================

/*
// File: src/hooks/useAccountBalance.js
import { useEffect, useState } from 'react'
import { accountAPI, handleApiError } from '@/services/apiServices'

export function useAccountBalance(pollIntervalMs = 30000) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initial load
    const loadBalance = async () => {
      try {
        const { balance } = await accountAPI.getBalance()
        setBalance(balance)
        setError(null)
      } catch (err) {
        const apiError = handleApiError(err)
        setError(apiError.message)
      } finally {
        setLoading(false)
      }
    }

    loadBalance()

    // Poll for updates
    const interval = setInterval(loadBalance, pollIntervalMs)

    return () => clearInterval(interval)
  }, [pollIntervalMs])

  return { balance, loading, error, refetch: () => loadBalance() }
}

// Usage:
// const { balance, loading, error } = useAccountBalance()
*/

export default {}
