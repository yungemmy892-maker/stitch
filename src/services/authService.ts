/**
 * JWT Authentication Service
 * Handles JWT token operations, validation, and refresh
 * Production-ready with proper security practices
 */

import { tokenManager } from '../utils/security'
import { apiClient } from './apiClient'

// ============================================================================
// Type Definitions
// ============================================================================

export interface JWTPayload {
  userId: string
  email: string
  name?: string
  plan?: string
  iat: number
  exp: number
  iss?: string
  aud?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn?: number
  tokenType?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    plan: string
    createdAt: string
  }
  tokens: AuthTokens
}

// ============================================================================
// JWT Helper Functions
// ============================================================================

/**
 * Parse JWT token without verification (client-side only)
 * WARNING: This does NOT verify the signature - always verify on backend!
 */
export const parseJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    const decoded = JSON.parse(atob(parts[1]))
    return decoded as JWTPayload
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return null
  }
}

/**
 * Check if JWT is expired
 */
export const isJWTExpired = (token: string, bufferSeconds = 60): boolean => {
  const payload = parseJWT(token)
  if (!payload) return true

  const now = Math.floor(Date.now() / 1000)
  return payload.exp - bufferSeconds < now
}

/**
 * Get time until JWT expiration
 */
export const getJWTExpirationTime = (token: string): number => {
  const payload = parseJWT(token)
  if (!payload) return 0

  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, payload.exp - now) * 1000 // Return milliseconds
}

// ============================================================================
// Authentication Service
// ============================================================================

class AuthService {
  private refreshTokenTimeout: ReturnType<typeof setTimeout> | null = null

  constructor() {
    this.setupTokenRefresh()
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials, {
        skipAuth: true,
      })

      // Store tokens
      tokenManager.storeTokens({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        expiresIn: response.tokens.accessTokenExpiresIn,
      })

      // Setup token refresh
      this.scheduleTokenRefresh(response.tokens.accessToken)

      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  /**
   * Sign up with email and password
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', data, {
        skipAuth: true,
      })

      // Store tokens
      tokenManager.storeTokens({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
        expiresIn: response.tokens.accessTokenExpiresIn,
      })

      // Setup token refresh
      this.scheduleTokenRefresh(response.tokens.accessToken)

      return response
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<AuthTokens> {
    try {
      const refreshToken = tokenManager.refreshToken || localStorage.getItem('refreshToken')

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiClient.post<AuthTokens>('/auth/refresh', {
        refreshToken,
      }, {
        skipAuth: true,
      })

      // Update stored tokens
      tokenManager.storeTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.accessTokenExpiresIn,
      })

      // Reschedule refresh
      this.scheduleTokenRefresh(response.accessToken)

      return response
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Logout on refresh failure
      this.logout()
      throw error
    }
  }

  /**
   * Verify current token is valid
   */
  async verifyToken(): Promise<boolean> {
    try {
      const token = tokenManager.getAccessToken()

      if (!token) {
        return false
      }

      // Check if expired (with 60 second buffer)
      if (isJWTExpired(token, 60)) {
        // Try to refresh
        try {
          await this.refreshToken()
          return true
        } catch {
          return false
        }
      }

      // Token is still valid
      return true
    } catch (error) {
      console.error('Token verification failed:', error)
      return false
    }
  }

  /**
   * Get current user from token
   */
  getCurrentUser(): JWTPayload | null {
    const token = tokenManager.getAccessToken()
    if (!token) return null

    return parseJWT(token)
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on backend
      await apiClient.post('/auth/logout', {})
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear local tokens regardless
      tokenManager.clearTokens()
      this.cancelTokenRefresh()
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = tokenManager.getAccessToken()
    if (!token) return false

    return !isJWTExpired(token)
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(token: string) {
    this.cancelTokenRefresh()

    const expirationTime = getJWTExpirationTime(token)
    // Refresh when 5 minutes left
    const refreshTime = Math.max(expirationTime - 5 * 60 * 1000, 1000)

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().catch((error) => {
        console.error('Automatic token refresh failed:', error)
      })
    }, refreshTime)
  }

  /**
   * Cancel scheduled token refresh
   */
  private cancelTokenRefresh() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout)
      this.refreshTokenTimeout = null
    }
  }

  /**
   * Setup refresh on app initialization
   */
  private setupTokenRefresh() {
    // On app load, verify token and setup refresh if needed
    const token = tokenManager.getAccessToken()
    if (token && !isJWTExpired(token)) {
      this.scheduleTokenRefresh(token)
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return apiClient.post('/auth/password/reset-request', { email }, {
      skipAuth: true,
    })
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post('/auth/password/reset-confirm', {
      token,
      password: newPassword,
    }, {
      skipAuth: true,
    })
  }

  /**
   * Change password (requires authentication)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post('/auth/password/change', {
      currentPassword,
      newPassword,
    })
  }

  /**
   * Setup two-factor authentication
   */
  async setup2FA(): Promise<{ qrCode: string; secret: string }> {
    return apiClient.post('/auth/2fa/setup', {})
  }

  /**
   * Verify two-factor authentication
   */
  async verify2FA(code: string): Promise<{ backupCodes: string[] }> {
    return apiClient.post('/auth/2fa/verify', { code })
  }

  /**
   * Disable two-factor authentication
   */
  async disable2FA(password: string): Promise<{ message: string }> {
    return apiClient.post('/auth/2fa/disable', { password })
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const authService = new AuthService()

export default authService
