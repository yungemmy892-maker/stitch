# Phase 3: Backend Integration Guide

## Overview

This guide covers integrating the Stitch fintech app with a real backend API. The infrastructure is now production-ready with an advanced API client, JWT authentication, and comprehensive error handling.

## Architecture

### API Layer Structure

```
├── src/services/
│   ├── apiClient.ts          # Advanced HTTP client with interceptors
│   ├── authService.ts         # JWT authentication & token management
│   ├── apiServices.ts         # Real API endpoints for features
│   └── api.js                # Legacy mock API (to be deprecated)
├── src/utils/
│   └── security.ts           # Token, password, CSRF, sanitization
└── .env                       # Environment configuration
```

### Request Flow

```
Frontend Component
    ↓
authService.login() or apiServices.getTransactions()
    ↓
APIClient (with interceptors)
    ↓
Request Interceptors:
    • auth: Inject JWT token
    • content-type: Set application/json
    • csrf: Add CSRF token if needed
    ↓
fetch() with timeout & abort control
    ↓
Response Handling:
    • Parse JSON/text/blob
    • Check for errors
    • Handle 401 (auto-refresh)
    • Retry if retryable
    ↓
Response Interceptors: (custom processing)
    ↓
Return data or throw ApiError
```

## Environment Configuration

### Development (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Stitch
VITE_APP_VERSION=0.0.1

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_LOGGING=false

# Environment
VITE_ENV=development
```

### Production (.env.production)

```bash
VITE_API_URL=https://api.stitch.com/api
VITE_API_TIMEOUT=10000
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_LOGGING=true
VITE_ENV=production
```

## Backend API Endpoints Required

### Authentication Endpoints

#### POST /auth/login
Authenticate user and return tokens

**Request:**
```json
{
  "email": "user@example.com",
  "password": "hashedpassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "premium",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "accessTokenExpiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

#### POST /auth/signup
Create new user account

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** (same as login)

#### POST /auth/refresh
Refresh access token using refresh token

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "accessTokenExpiresIn": 3600
}
```

#### POST /auth/logout
Invalidate tokens on server

**Request:** (empty body)

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### POST /auth/password/reset-request
Request password reset link

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset link sent to email"
}
```

#### POST /auth/password/reset-confirm
Confirm password reset with token

**Request:**
```json
{
  "token": "reset_token_123",
  "password": "NewPassword123!"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

### Transaction Endpoints

#### GET /transactions?limit=10&offset=0
Get user's transactions with pagination

**Response:**
```json
{
  "transactions": [
    {
      "id": "tx123",
      "type": "debit",
      "amount": 50.00,
      "description": "Coffee Shop",
      "date": "2024-01-15T10:30:00Z",
      "status": "completed",
      "category": "Food & Drink"
    }
  ],
  "total": 150
}
```

#### GET /transactions/:id
Get specific transaction

#### POST /transactions
Create new transaction

**Request:**
```json
{
  "type": "debit",
  "amount": 50.00,
  "description": "Payment",
  "category": "Shopping"
}
```

#### PUT /transactions/:id
Update transaction

#### DELETE /transactions/:id
Delete transaction

#### GET /transactions/stats?period=30d
Get transaction statistics

**Response:**
```json
{
  "totalIn": 5000.00,
  "totalOut": 3500.00,
  "netChange": 1500.00,
  "period": "30d"
}
```

### Account Endpoints

#### GET /account
Get primary account

**Response:**
```json
{
  "id": "acc123",
  "userId": "user123",
  "accountNumber": "4532xxxxxxxxxx55",
  "balance": 2500.00,
  "currency": "USD",
  "type": "checking",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### GET /accounts
Get all user accounts

#### POST /accounts
Create new account

#### GET /account/balance
Get account balance

#### POST /transfers
Transfer between accounts

**Request:**
```json
{
  "fromAccountId": "acc123",
  "toAccountId": "acc456",
  "amount": 500.00,
  "description": "Transfer to savings"
}
```

### Dashboard Endpoints

#### GET /dashboard
Get complete dashboard data

**Response:**
```json
{
  "account": { /* Account object */ },
  "transactions": [ /* Transaction array */ ],
  "stats": {
    "totalIn": 5000.00,
    "totalOut": 3500.00,
    "netChange": 1500.00,
    "period": "30d"
  }
}
```

#### POST /dashboard/refresh
Refresh dashboard data

### User Profile Endpoints

#### GET /user/profile
Get current user profile

#### PUT /user/profile
Update user profile

**Request:**
```json
{
  "name": "Updated Name",
  "plan": "premium"
}
```

#### POST /user/email/update
Update email address

**Request:**
```json
{
  "newEmail": "newemail@example.com",
  "password": "currentPassword"
}
```

#### POST /user/delete
Delete user account

#### GET /user/preferences
Get user preferences

#### PUT /user/preferences
Update user preferences

## Integration Steps

### 1. Update Environment Variables

Set your backend API URL in `.env`:

```bash
VITE_API_URL=https://your-backend-api.com/api
```

### 2. Using AuthService for Login

```typescript
import { authService } from '@/services/authService'

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
})

// Access user info
const user = authService.getCurrentUser()

// Check authentication
const isAuth = authService.isAuthenticated()

// Logout
await authService.logout()
```

### 3. Making API Calls

```typescript
import { transactionAPI, accountAPI, dashboardAPI } from '@/services/apiServices'

// Get transactions
const { transactions, total } = await transactionAPI.getTransactions(10, 0)

// Get account balance
const { balance } = await accountAPI.getBalance()

// Get dashboard
const dashboard = await dashboardAPI.getDashboard()
```

### 4. Error Handling

```typescript
import { handleApiError } from '@/services/apiServices'

try {
  await transactionAPI.getTransactions()
} catch (error) {
  const apiError = handleApiError(error)
  console.error(`Error [${apiError.code}]: ${apiError.message}`)
}
```

### 5. Token Refresh

The API client automatically handles token refresh:

```typescript
// Configure automatic token refresh
import { authService } from '@/services/authService'

// Token refresh happens automatically when:
// 1. API returns 401 Unauthorized
// 2. Token expiration approaches (5 minutes before expiry)
// 3. Concurrent requests are queued during refresh
```

## Security Considerations

### 1. Token Storage

- **Access Token:** Stored in `localStorage` (for simplicity)
- **Refresh Token:** Should be in `httpOnly` cookie (for production)
  
**Production Recommendation:**
```typescript
// Use httpOnly cookie for refresh token
document.cookie = `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict`

// Access token can stay in memory for better XSS protection
```

### 2. Token Security

The `tokenManager` provides:
- Secure token storage validation
- Expiration checking
- Token type validation
- Clear token methods

### 3. CSRF Protection

```typescript
// CSRF token is automatically added to requests
// Server should provide CSRF token in meta tag:
<meta name="csrf-token" content="token_value" />
```

### 4. Password Validation

```typescript
import { passwordManager } from '@/utils/security'

// Validate password strength
const { passes, score, feedback } = passwordManager.validate('Password123!')
// score: 0-4 (weak to strong)
```

### 5. Input Sanitization

```typescript
import { sanitizer } from '@/utils/security'

// Sanitize HTML input
const clean = sanitizer.sanitizeHtml(userInput)

// Validate email
const isValid = sanitizer.validateEmail(email)
```

## Retry Strategy

The API client uses exponential backoff for retries:

```
Retry 1: Wait 1000ms
Retry 2: Wait 2000ms
Retry 3: Wait 4000ms
Max Attempts: 3
```

**Retryable Errors:**
- Network timeouts
- 5xx server errors
- 429 rate limit errors

**Non-Retryable:**
- 401 Unauthorized (triggers refresh instead)
- 400 Bad Request
- 403 Forbidden
- 404 Not Found

## Request/Response Interceptors

### Adding Custom Interceptors

```typescript
import { apiClient } from '@/services/apiClient'

// Request interceptor
apiClient.addRequestInterceptor({
  name: 'custom-logger',
  handler: (config) => {
    console.log(`Requesting ${config.method} ${endpoint}`)
    return config
  }
})

// Response interceptor
apiClient.addResponseInterceptor({
  name: 'custom-parser',
  handler: (response, data) => {
    // Process response
    return data
  }
})
```

### Default Interceptors

1. **Auth**: Injects JWT token from `tokenManager`
2. **Content-Type**: Sets `application/json` for requests with body
3. **CSRF**: Adds `X-CSRF-Token` header from meta tag

## Error Handling

### API Error Types

```typescript
interface ApiError {
  message: string          // Error message
  code: string            // Error code (e.g., 'INVALID_EMAIL')
  statusCode: number      // HTTP status code
  details?: Record<string, unknown>  // Additional error details
  retryable: boolean      // Whether request was retried
}
```

### Common Error Codes

- `NETWORK_ERROR`: Network connectivity issue
- `TIMEOUT_ERROR`: Request exceeded timeout
- `PARSE_ERROR`: Failed to parse response
- `INVALID_EMAIL`: Email validation failed
- `WEAK_PASSWORD`: Password doesn't meet requirements
- `UNAUTHORIZED`: Invalid credentials
- `TOKEN_EXPIRED`: JWT token expired
- `RATE_LIMITED`: Too many requests

### Error Handler Usage

```typescript
import { handleApiError } from '@/services/apiServices'

try {
  await someApiCall()
} catch (error) {
  const { code, message, details } = handleApiError(error)
  
  switch (code) {
    case 'UNAUTHORIZED':
      // Redirect to login
      break
    case 'RATE_LIMITED':
      // Show rate limit message
      break
    case 'NETWORK_ERROR':
      // Retry later
      break
  }
}
```

## Testing Integration

### Unit Testing API Calls

```typescript
import { describe, it, expect, vi } from 'vitest'
import { transactionAPI } from '@/services/apiServices'

describe('Transaction API', () => {
  it('should fetch transactions', async () => {
    vi.mock('@/services/apiClient', () => ({
      apiClient: {
        get: vi.fn().mockResolvedValue({
          transactions: [],
          total: 0
        })
      }
    }))

    const result = await transactionAPI.getTransactions()
    expect(result.transactions).toEqual([])
  })
})
```

### E2E Testing Authentication

```typescript
import { expect, test } from 'vitest'
import { authService } from '@/services/authService'

test('complete auth flow', async () => {
  // Signup
  const signupResult = await authService.signup({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!'
  })
  
  expect(signupResult.user.email).toBe('test@example.com')
  expect(authService.isAuthenticated()).toBe(true)
  
  // Logout
  await authService.logout()
  expect(authService.isAuthenticated()).toBe(false)
})
```

## Performance Optimization

### Request Caching

```typescript
// Add caching interceptor
apiClient.addResponseInterceptor({
  name: 'cache',
  handler: (response, data) => {
    // Cache GET requests using IndexedDB or sessionStorage
    return data
  }
})
```

### Connection Pooling

```typescript
// Configure timeout and connection settings
const config = {
  timeout: 30000,
  retries: 3,
  headers: {
    'Connection': 'keep-alive'
  }
}
```

## Monitoring & Logging

### Error Logging

```typescript
apiClient.addResponseInterceptor({
  name: 'error-logging',
  handler: (response, data) => {
    if (!response.ok) {
      // Log to monitoring service
      console.error('API Error:', {
        status: response.status,
        endpoint: response.url,
        timestamp: new Date().toISOString()
      })
    }
    return data
  }
})
```

### Request Metrics

```typescript
apiClient.addRequestInterceptor({
  name: 'metrics',
  handler: (config) => {
    const startTime = performance.now()
    
    // After request completes, record metrics
    // endTime - startTime = request duration
    
    return config
  }
})
```

## Troubleshooting

### Token Refresh Loop

**Problem:** App keeps refreshing token infinitely

**Solution:**
```typescript
// Check token expiration time
const timeMsUntilExpiry = getJWTExpirationTime(token)
// Should be greater than 0

// Verify refresh token exists
const refreshToken = tokenManager.refreshToken
// Should not be empty
```

### 401 Unauthorized Errors

**Problem:** Getting 401 even with valid token

**Solutions:**
1. Check token hasn't expired: `isJWTExpired(token)`
2. Verify token is being sent: Check Network tab for `Authorization` header
3. Confirm token refresh endpoint URL is correct (see `.env`)

### CORS Errors

**Problem:** `No 'Access-Control-Allow-Origin' header`

**Backend Configuration Needed:**
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}))
```

### Network Timeouts

**Problem:** Requests timing out

**Solutions:**
1. Increase timeout in `.env`: `VITE_API_TIMEOUT=30000`
2. Check API server is running
3. Verify API URL in `.env` is correct

## Next Steps

1. **Setup Backend Server**
   - Create Node.js/Express server
   - Implement JWT authentication
   - Setup database (MongoDB, PostgreSQL, etc.)

2. **Database Integration**
   - Create database schema for users, transactions, accounts
   - Setup migrations
   - Create database models

3. **API Endpoints**
   - Implement all endpoints listed above
   - Add request validation
   - Add response formatting

4. **Security Hardening**
   - Rate limiting
   - CORS configuration
   - HTTPS/TLS setup
   - Input validation & sanitization

5. **Testing**
   - Unit tests for API clients
   - Integration tests with mock backend
   - E2E tests with real backend

## API Response Format

All API responses should follow this format:

```json
{
  "success": true,
  "data": {
    // Actual response data
  },
  "error": null,
  "code": "SUCCESS",
  "statusCode": 200,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "data": null,
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS",
  "statusCode": 401,
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "field": "email",
    "message": "Email not found"
  }
}
```

## Support & Resources

- **API Client Documentation**: See `src/services/apiClient.ts`
- **Auth Service Documentation**: See `src/services/authService.ts`
- **Security Utils**: See `src/utils/security.ts`
- **API Services**: See `src/services/apiServices.ts`
- **Environment Setup**: See `.env.example`

---

**Phase 3 Completion Status**: ✅ Backend Integration Infrastructure Ready

For questions or issues, refer to the inline code documentation in each service file.
