/**
 * Security Utilities
 * Provides functions for authentication tokens, password management, CSRF protection,
 * and input sanitization
 */

import crypto from 'crypto'

// ============================================================================
// JWT Token Management
// ============================================================================

interface TokenPayload {
  userId: string
  email: string
  plan?: string
  iat?: number
  exp?: number
}

interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * JWT Token utilities - In production, use a proper JWT library like jsonwebtoken
 * This is a simplified implementation for reference
 */
export const tokenManager = {
  /**
   * Store tokens in localStorage (in production: use httpOnly cookies for refresh token)
   */
  storeTokens(tokens: TokenPair): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('tokenExpiry', (Date.now() + tokens.expiresIn * 1000).toString())
    }
  },

  /**
   * Retrieve access token from storage
   */
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token && !tokenManager.isTokenExpired()) {
        return token
      }
      tokenManager.clearTokens()
      return null
    }
    return null
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    if (typeof window !== 'undefined') {
      const expiry = localStorage.getItem('tokenExpiry')
      if (!expiry) return true
      return Date.now() > parseInt(expiry, 10)
    }
    return true
  },

  /**
   * Clear all tokens from storage (logout)
   */
  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tokenExpiry')
    }
  },

  /**
   * Validate token format (basic check)
   */
  isValidToken(token: string): boolean {
    return /^Bearer\s[\w\-\.]+\.[\w\-\.]+\.[\w\-\.]+$/.test(token)
  },
}

// ============================================================================
// Password Management
// ============================================================================

export const passwordManager = {
  /**
   * Validate password strength
   * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
   */
  isStrongPassword(password: string): {
    isStrong: boolean
    feedback: string[]
  } {
    const feedback: string[] = []

    if (password.length < 8) feedback.push('At least 8 characters')
    if (!/[A-Z]/.test(password)) feedback.push('At least one uppercase letter')
    if (!/[a-z]/.test(password)) feedback.push('At least one lowercase letter')
    if (!/\d/.test(password)) feedback.push('At least one number')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) feedback.push('At least one special character')

    return {
      isStrong: feedback.length === 0,
      feedback,
    }
  },

  /**
   * Hash password (client-side - for demo only)
   * In production: hash on backend with bcryptjs or similar
   */
  hashPassword(password: string): string {
    // This is a placeholder. Real password hashing MUST happen on the backend
    // DO NOT rely on client-side hashing for security
    return btoa(password) // Base64 encoding - NOT SAFE FOR PRODUCTION
  },

  /**
   * Verify password matches hash (client-side - for demo only)
   */
  verifyPassword(password: string, hash: string): boolean {
    return btoa(password) === hash
  },
}

// ============================================================================
// Input Sanitization & Validation
// ============================================================================

export const sanitizer = {
  /**
   * Remove dangerous HTML/script tags from input
   */
  sanitizeHTML(input: string): string {
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate phone number (basic US format)
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  /**
   * Remove XSS-dangerous characters
   */
  escapeHTML(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, (char) => map[char])
  },

  /**
   * Validate and sanitize URL
   */
  isValidURL(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * Remove all non-numeric characters
   */
  extractNumbers(input: string): string {
    return input.replace(/\D/g, '')
  },
}

// ============================================================================
// CSRF Protection
// ============================================================================

export const csrfProtection = {
  /**
   * Generate CSRF token (store server-side and return to client)
   */
  generateToken(): string {
    if (typeof window !== 'undefined') {
      const randomBytes = new Uint8Array(32)
      crypto.getRandomValues(randomBytes)
      return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
    }
    return ''
  },

  /**
   * Store CSRF token
   */
  storeCSRFToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('csrfToken', token)
    }
  },

  /**
   * Retrieve CSRF token for requests
   */
  getCSRFToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('csrfToken')
    }
    return null
  },

  /**
   * Add CSRF token to request headers
   */
  addCSRFHeader(headers: Record<string, string>): Record<string, string> {
    const token = csrfProtection.getCSRFToken()
    if (token) {
      return {
        ...headers,
        'X-CSRF-Token': token,
      }
    }
    return headers
  },
}

// ============================================================================
// Secure Headers & Best Practices
// ============================================================================

export const secureHeaders = {
  /**
   * Get recommended security headers
   */
  getRecommendedHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    }
  },

  /**
   * Check if connection is secure (HTTPS)
   */
  isSecureConnection(): boolean {
    if (typeof window !== 'undefined') {
      return window.location.protocol === 'https:'
    }
    return true
  },
}

// ============================================================================
// Two-Factor Authentication (2FA) Placeholder
// ============================================================================

export const twoFactorAuth = {
  /**
   * Generate 2FA QR code URI (for TOTP apps like Google Authenticator)
   * In production: use speakeasy or similar library
   */
  generateQRCodeURI(email: string): string {
    // Placeholder - in production use proper TOTP library
    return `otpauth://totp/Stitch:${email}?secret=JBSWY3DPEBLW64TMMQ======&issuer=Stitch`
  },

  /**
   * Verify 2FA code
   */
  verify2FACode(code: string): boolean {
    // Placeholder - in production validate against TOTP secret
    return /^\d{6}$/.test(code)
  },
}

export default {
  tokenManager,
  passwordManager,
  sanitizer,
  csrfProtection,
  secureHeaders,
  twoFactorAuth,
}
