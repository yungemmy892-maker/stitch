/**
 * Real API Services
 * Replace mock API calls with actual backend endpoints
 * Uses the advanced API client with interceptors
 */

import { apiClient } from './apiClient'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
  status: 'pending' | 'completed' | 'failed'
  category?: string
  reference?: string
}

export interface Account {
  id: string
  userId: string
  accountNumber: string
  balance: number
  currency: string
  type: 'checking' | 'savings'
  createdAt: string
}

export interface Dashboard {
  account: Account
  transactions: Transaction[]
  stats: {
    totalIn: number
    totalOut: number
    netChange: number
    period: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  plan: string
  createdAt: string
}

export interface ApiErrorResponse {
  error: string
  code: string
  message: string
  details?: Record<string, unknown>
}

// ============================================================================
// Transaction API
// ============================================================================

export const transactionAPI = {
  /**
   * Get all transactions for user
   */
  async getTransactions(
    limit = 10,
    offset = 0,
    filters?: { type?: string; status?: string; dateFrom?: string; dateTo?: string }
  ): Promise<{ transactions: Transaction[]; total: number }> {
    return apiClient.get('/transactions', {
      headers: {
        'X-Limit': limit.toString(),
        'X-Offset': offset.toString(),
        ...(filters && Object.keys(filters).length > 0 && { 'X-Filters': JSON.stringify(filters) }),
      },
    })
  },

  /**
   * Get single transaction by ID
   */
  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get(`/transactions/${id}`)
  },

  /**
   * Create new transaction
   */
  async createTransaction(data: Omit<Transaction, 'id' | 'status'>): Promise<Transaction> {
    return apiClient.post('/transactions', data)
  },

  /**
   * Update transaction
   */
  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    return apiClient.put(`/transactions/${id}`, data)
  },

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/transactions/${id}`)
  },

  /**
   * Get transaction statistics
   */
  async getStatistics(period = '30d'): Promise<{
    totalIn: number
    totalOut: number
    netChange: number
    period: string
  }> {
    return apiClient.get('/transactions/stats', {
      headers: { 'X-Period': period },
    })
  },

  /**
   * Export transactions as CSV
   */
  async exportTransactions(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await apiClient.request('/transactions/export', {
      method: 'GET',
      headers: { 'X-Format': format },
    })
    return response as Blob
  },
}

// ============================================================================
// Account API
// ============================================================================

export const accountAPI = {
  /**
   * Get user's account details
   */
  async getAccount(): Promise<Account> {
    return apiClient.get('/account')
  },

  /**
   * Get all user accounts
   */
  async getAccounts(): Promise<Account[]> {
    return apiClient.get('/accounts')
  },

  /**
   * Create new account
   */
  async createAccount(data: Omit<Account, 'id' | 'userId' | 'createdAt'>): Promise<Account> {
    return apiClient.post('/accounts', data)
  },

  /**
   * Update account
   */
  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    return apiClient.put(`/accounts/${id}`, data)
  },

  /**
   * Get account balance
   */
  async getBalance(accountId?: string): Promise<{ balance: number; currency: string }> {
    const endpoint = accountId ? `/accounts/${accountId}/balance` : '/account/balance'
    return apiClient.get(endpoint)
  },

  /**
   * Transfer money between accounts
   */
  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description: string
  ): Promise<{ transactionId: string; status: string }> {
    return apiClient.post('/transfers', {
      fromAccountId,
      toAccountId,
      amount,
      description,
    })
  },
}

// ============================================================================
// Dashboard API
// ============================================================================

export const dashboardAPI = {
  /**
   * Get complete dashboard data
   */
  async getDashboard(): Promise<Dashboard> {
    return apiClient.get('/dashboard')
  },

  /**
   * Get dashboard with custom period
   */
  async getDashboardWithPeriod(period: string): Promise<Dashboard> {
    return apiClient.get('/dashboard', {
      headers: { 'X-Period': period },
    })
  },

  /**
   * Refresh dashboard data
   */
  async refreshDashboard(): Promise<Dashboard> {
    return apiClient.post('/dashboard/refresh', {})
  },
}

// ============================================================================
// User API
// ============================================================================

export const userAPI = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return apiClient.get('/user/profile')
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    return apiClient.put('/user/profile', data)
  },

  /**
   * Update user email
   */
  async updateEmail(newEmail: string, password: string): Promise<{ message: string }> {
    return apiClient.post('/user/email/update', {
      newEmail,
      password,
    })
  },

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    return apiClient.post('/user/delete', { password })
  },

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<Record<string, unknown>> {
    return apiClient.get('/user/preferences')
  },

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Record<string, unknown>): Promise<Record<string, unknown>> {
    return apiClient.put('/user/preferences', preferences)
  },
}

// ============================================================================
// Notification API
// ============================================================================

export const notificationAPI = {
  /**
   * Get user notifications
   */
  async getNotifications(limit = 20): Promise<Array<{
    id: string
    type: string
    message: string
    read: boolean
    createdAt: string
  }>> {
    return apiClient.get('/notifications', {
      headers: { 'X-Limit': limit.toString() },
    })
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    return apiClient.put(`/notifications/${notificationId}`, { read: true })
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/notifications/${notificationId}`)
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<Record<string, boolean>> {
    return apiClient.get('/notifications/preferences')
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: Record<string, boolean>): Promise<Record<string, boolean>> {
    return apiClient.put('/notifications/preferences', preferences)
  },
}

// ============================================================================
// Error Handling Helper
// ============================================================================

/**
 * Handle API errors consistently across the app
 */
export const handleApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      error: (error as Record<string, unknown>).message as string,
      code: (error as Record<string, unknown>).code as string || 'UNKNOWN_ERROR',
      message: (error as Record<string, unknown>).message as string,
      details: (error as Record<string, unknown>).details as Record<string, unknown>,
    }
  }

  return {
    error: String(error),
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  }
}

export default {
  transactionAPI,
  accountAPI,
  dashboardAPI,
  userAPI,
  notificationAPI,
  handleApiError,
}
