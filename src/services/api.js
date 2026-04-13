/**
 * API Service Layer
 * Centralized API communication for future backend integration
 * Currently uses mock data with delays to simulate async operations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

class APIError extends Error {
  constructor(message, status, code = 'API_ERROR') {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.code = code
  }
}

/**
 * Timeout wrapper for fetch
 */
async function fetchWithTimeout(url, options = {}, timeout = API_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new APIError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    if (error.name === 'AbortError') {
      throw new APIError('Request timeout', 408, 'TIMEOUT_ERROR')
    }
    throw new APIError(error.message, 500, 'NETWORK_ERROR')
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Auth API endpoints
 */
export const authAPI = {
  /**
   * Sign up new user
   * @param {Object} credentials
   * @param {string} credentials.name
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<Object>} User data with token
   */
  async signup(credentials) {
    try {
      // TODO: Replace with actual API call
      // const response = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // })

      // Mock: Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw new APIError('Email and password are required', 400, 'VALIDATION_ERROR')
      }

      if (credentials.password.length < 6) {
        throw new APIError('Password must be at least 6 characters', 400, 'VALIDATION_ERROR')
      }

      return {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: credentials.name,
        email: credentials.email,
        token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 20),
        plan: 'Basic',
      }
    } catch (error) {
      console.error('[Auth] Signup error:', error)
      throw error instanceof APIError ? error : new APIError(error.message, 500)
    }
  },

  /**
   * Login user
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<Object>} User data with token
   */
  async login(credentials) {
    try {
      if (!credentials.email || !credentials.password) {
        throw new APIError('Email and password are required', 400, 'VALIDATION_ERROR')
      }

      // TODO: Replace with actual API call
      // const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // })

      // Mock: Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation - in real app, backend validates password hash
      if (credentials.email === 'test@test.com' && credentials.password === 'test123') {
        return {
          id: 'user_123',
          name: 'Test User',
          email: credentials.email,
          token: 'mock_jwt_token_abcd1234',
          plan: 'Pro',
        }
      }

      // Default: Accept any credentials for demo
      return {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 20),
        plan: 'Basic',
      }
    } catch (error) {
      console.error('[Auth] Login error:', error)
      throw error instanceof APIError ? error : new APIError(error.message, 500)
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      // TODO: Replace with actual API call
      // await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}` },
      // })

      // Mock: Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true }
    } catch (error) {
      console.error('[Auth] Logout error:', error)
      throw error instanceof APIError ? error : new APIError(error.message, 500)
    }
  },

  /**
   * Verify token
   */
  async verifyToken(token) {
    try {
      if (!token) {
        throw new APIError('Token is required', 400, 'VALIDATION_ERROR')
      }

      // Mock: Token validation
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (token.startsWith('mock_jwt_token_')) {
        return { valid: true }
      }

      throw new APIError('Invalid token', 401, 'INVALID_TOKEN')
    } catch (error) {
      console.error('[Auth] Token verification error:', error)
      throw error instanceof APIError ? error : new APIError(error.message, 500)
    }
  },
}

/**
 * Transaction API endpoints
 */
export const transactionAPI = {
  /**
   * Get transactions
   */
  async getTransactions(filters = {}) {
    try {
      // TODO: Replace with actual API call
      // const params = new URLSearchParams(filters)
      // const response = await fetchWithTimeout(`${API_BASE_URL}/transactions?${params}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // })

      // Mock: Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      return []
    } catch (error) {
      console.error('[Transactions] Fetch error:', error)
      throw error instanceof APIError ? error : new APIError(error.message, 500)
    }
  },

  /**
   * Send money
   */
  async sendMoney(data) {
    try {
      if (!data.recipientEmail || !data.amount) {
        throw new APIError('Recipient and amount are required', 400, 'VALIDATION_ERROR')
      }

      if (data.amount <= 0) {
        throw new APIError('Amount must be greater than 0', 400, 'VALIDATION_ERROR')
      }

      // Mock: Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      return {
        id: 'tx_' + Math.random().toString(36).substr(2, 9),
        type: 'send',
        amount: -data.amount,
        recipient: data.recipientEmail,
        status: 'completed',
        date: new Date().toISOString(),
      }
    } catch (error) {
      console.error('[Transactions] Send money error:', error)
      throw error instanceof APIError ? error : new APIError(error.message, 500)
    }
  },

  /**
   * Request money
   */
  async requestMoney(data) {
    try {
      if (!data.senderEmail || !data.amount) {
        throw new APIError('Sender and amount are required', 400, 'VALIDATION_ERROR')
      }

      // Mock: Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      return {
        id: 'req_' + Math.random().toString(36).substr(2, 9),
        type: 'request',
        amount: data.amount,
        vendor: data.senderEmail,
        status: 'pending',
        date: new Date().toISOString(),
      }
    } catch (error) {
      console.error('[Transactions] Request money error:', error)
      throw error instanceof APIError ? error : new APIError(error.message, 500)
    }
  },
}

export { APIError }
