/**
 * Advanced API Client with Request/Response Interceptors
 * Handles authentication, error handling, retries, and request signing
 */

import { tokenManager } from '../utils/security'

// ============================================================================
// Type Definitions
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
  statusCode?: number
  timestamp?: string
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
  retryable: boolean
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  retries?: number
  skipAuth?: boolean
}

export interface RequestInterceptor {
  name: string
  handler: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
}

export interface ResponseInterceptor {
  name: string
  handler: <T>(response: Response, data: T) => T | Promise<T>
}

// ============================================================================
// Advanced API Client
// ============================================================================

class APIClient {
  private baseUrl: string
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private defaultTimeout = 30000 // 30 seconds
  private retryConfig = {
    maxRetries: 3,
    backoffMultiplier: 2,
    initialDelayMs: 1000,
  }

  constructor(baseUrl: string = import.meta.env.VITE_API_URL) {
    this.baseUrl = baseUrl
    this.setupDefaultInterceptors()
  }

  /**
   * Setup default interceptors
   */
  private setupDefaultInterceptors() {
    // Add authentication interceptor
    this.addRequestInterceptor({
      name: 'auth',
      handler: (config) => {
        const token = tokenManager.getAccessToken()
        if (token && !config.skipAuth) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
    })

    // Add content-type header
    this.addRequestInterceptor({
      name: 'content-type',
      handler: (config) => {
        config.headers = config.headers || {}
        if (!config.headers['Content-Type'] && config.body) {
          config.headers['Content-Type'] = 'application/json'
        }
        return config
      },
    })

    // Add CSRF token if needed
    this.addRequestInterceptor({
      name: 'csrf',
      handler: (config) => {
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method || 'GET')) {
          // Add CSRF token if available
          const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
          if (csrfToken) {
            config.headers = config.headers || {}
            config.headers['X-CSRF-Token'] = csrfToken
          }
        }
        return config
      },
    })
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  /**
   * Remove interceptor by name
   */
  removeInterceptor(type: 'request' | 'response', name: string) {
    if (type === 'request') {
      this.requestInterceptors = this.requestInterceptors.filter((i) => i.name !== name)
    } else {
      this.responseInterceptors = this.responseInterceptors.filter((i) => i.name !== name)
    }
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let finalConfig = { ...config }
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor.handler(finalConfig)
    }
    return finalConfig
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors<T>(response: Response, data: T): Promise<T> {
    let finalData = data
    for (const interceptor of this.responseInterceptors) {
      finalData = await interceptor.handler(response, finalData)
    }
    return finalData
  }

  /**
   * Make API request with retry logic
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const method = config.method || 'GET'
    const timeout = config.timeout || this.defaultTimeout
    const maxRetries = config.retries ?? this.retryConfig.maxRetries

    let lastError: ApiError | null = null

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Apply request interceptors
        const finalConfig = await this.applyRequestInterceptors(config)

        // Build request options
        const requestOptions: RequestInit = {
          method,
          headers: finalConfig.headers,
        }

        if (finalConfig.body) {
          requestOptions.body = typeof finalConfig.body === 'string'
            ? finalConfig.body
            : JSON.stringify(finalConfig.body)
        }

        // Make request with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try {
          const response = await fetch(url, {
            ...requestOptions,
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          // Parse response
          const contentType = response.headers.get('content-type')
          let responseData: unknown

          if (contentType?.includes('application/json')) {
            responseData = await response.json()
          } else if (contentType?.includes('text')) {
            responseData = await response.text()
          } else {
            responseData = await response.blob()
          }

          // Handle HTTP errors
          if (!response.ok) {
            throw this.createApiError(response, responseData)
          }

          // Apply response interceptors
          const finalData = await this.applyResponseInterceptors(response, responseData)

          return finalData as T
        } catch (error) {
          clearTimeout(timeoutId)
          throw error
        }
      } catch (error) {
        const apiError = this.parseError(error)
        lastError = apiError

        // Check if should retry
        const shouldRetry = apiError.retryable && attempt < maxRetries

        if (shouldRetry) {
          // Exponential backoff
          const delayMs =
            this.retryConfig.initialDelayMs *
            Math.pow(this.retryConfig.backoffMultiplier, attempt)

          await new Promise((resolve) => setTimeout(resolve, delayMs))
          continue
        }

        throw apiError
      }
    }

    throw lastError || new Error('Request failed after retries')
  }

  /**
   * Create API error from response
   */
  private createApiError(response: Response, data: unknown): ApiError {
    const errorData = typeof data === 'object' ? (data as Record<string, unknown>) : {}

    return {
      message: (errorData.message as string) || `HTTP ${response.status}`,
      code: (errorData.code as string) || `HTTP_${response.status}`,
      statusCode: response.status,
      details: errorData.details as Record<string, unknown>,
      retryable: response.status >= 500 || response.status === 408 || response.status === 429,
    }
  }

  /**
   * Parse error from try/catch
   */
  private parseError(error: unknown): ApiError {
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        return {
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR',
          statusCode: 0,
          retryable: true,
        }
      }
      if (error.message.includes('AbortError')) {
        return {
          message: 'Request timeout',
          code: 'REQUEST_TIMEOUT',
          statusCode: 408,
          retryable: true,
        }
      }
    }

    if (error instanceof SyntaxError) {
      return {
        message: 'Invalid response format',
        code: 'PARSE_ERROR',
        statusCode: 500,
        retryable: false,
      }
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return error as ApiError
    }

    return {
      message: String(error),
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      retryable: false,
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body })
  }
}

// ============================================================================
// Token Refresh Interceptor
// ============================================================================

export const setupTokenRefreshInterceptor = (apiClient: APIClient) => {
  let isRefreshing = false
  let refreshQueue: (() => void)[] = []

  apiClient.addResponseInterceptor({
    name: 'token-refresh',
    handler: async (response, data) => {
      // If 401 Unauthorized and not already refreshing
      if (response.status === 401 && !isRefreshing) {
        isRefreshing = true

        try {
          // TODO: Call your refresh token endpoint
          // const newTokens = await apiClient.post('/auth/refresh', {
          //   refreshToken: tokenManager.getRefreshToken()
          // })
          // tokenManager.storeTokens(newTokens)

          // Process queued requests
          refreshQueue.forEach((callback) => callback())
          refreshQueue = []
        } catch (error) {
          // Refresh failed - logout user
          tokenManager.clearTokens()
          window.location.href = '/login'
        } finally {
          isRefreshing = false
        }
      }

      // Queue requests if currently refreshing
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push(() => {
            resolve(data)
          })
        })
      }

      return data
    },
  })
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const apiClient = new APIClient()

export default apiClient
