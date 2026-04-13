import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authAPI, APIError } from '../../services/api'

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signup', () => {
    it('should throw error if email is missing', async () => {
      await expect(
        authAPI.signup({ name: 'John', password: 'test123' })
      ).rejects.toThrow('Email and password are required')
    })

    it('should throw error if password is less than 6 characters', async () => {
      await expect(
        authAPI.signup({ name: 'John', email: 'john@test.com', password: '12345' })
      ).rejects.toThrow('Password must be at least 6 characters')
    })

    it('should return user data with token on success', async () => {
      const result = await authAPI.signup({
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
      })

      expect(result).toHaveProperty('name', 'John Doe')
      expect(result).toHaveProperty('email', 'john@test.com')
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('plan', 'Basic')
    })
  })

  describe('login', () => {
    it('should throw error if email is missing', async () => {
      await expect(
        authAPI.login({ password: 'test123' })
      ).rejects.toThrow('Email and password are required')
    })

    it('should return user data on successful login', async () => {
      const result = await authAPI.login({
        email: 'test@test.com',
        password: 'test123',
      })

      expect(result).toHaveProperty('email')
      expect(result).toHaveProperty('token')
    })
  })

  describe('logout', () => {
    it('should return success on logout', async () => {
      const result = await authAPI.logout()
      expect(result).toEqual({ success: true })
    })
  })
})

describe('APIError', () => {
  it('should create error with correct properties', () => {
    const error = new APIError('Test error', 500, 'TEST_ERROR')

    expect(error.message).toBe('Test error')
    expect(error.status).toBe(500)
    expect(error.code).toBe('TEST_ERROR')
    expect(error.name).toBe('APIError')
  })
})
