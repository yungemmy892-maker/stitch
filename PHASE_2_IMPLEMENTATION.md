# Phase 2: Security & Accessibility Implementation

## Overview

Phase 2 builds on the Phase 1 production foundations to add **enterprise-grade security** and **WCAG 2.1 AA accessibility** compliance, making the Stitch fintech app suitable for regulated environments and inclusive for all users.

## 🔒 Security Implementation

### 1. Token Management (`src/utils/security.ts`)

**JWT Token Storage & Management:**
```typescript
import { tokenManager } from '../utils/security'

// Store tokens after login
tokenManager.storeTokens({
  accessToken: 'eyJhbGc...',
  refreshToken: 'eyJhbGc...',
  expiresIn: 3600,
})

// Retrieve token for API calls
const token = tokenManager.getAccessToken()

// Check if token expired
if (tokenManager.isTokenExpired()) {
  // Refresh token via API
}

// Logout
tokenManager.clearTokens()
```

**Production Checklist:**
- [ ] Use httpOnly cookies for refresh tokens (not localStorage)
- [ ] Implement token refresh endpoint
- [ ] Set up CORS to restrict API access
- [ ] Add rate limiting on token endpoints
- [ ] Rotate tokens regularly

### 2. Password Security

**Password Strength Validation:**
```typescript
import { passwordManager } from '../utils/security'

const { isStrong, feedback } = passwordManager.isStrongPassword(password)
if (!isStrong) {
  console.log('Password needs:', feedback)
  // ['At least one uppercase letter', 'At least one special character']
}
```

**Requirements:**
- Minimum 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character

**Production Checklist:**
- [ ] Hash passwords with bcryptjs on backend
- [ ] Use salt rounds ≥ 10
- [ ] Never store plain text passwords
- [ ] Implement password reset with time-limited tokens
- [ ] Add password history to prevent reuse

### 3. Input Sanitization

**Prevent XSS Attacks:**
```typescript
import { sanitizer } from '../utils/security'

// Remove script tags
const safe = sanitizer.sanitizeHTML(userInput)

// Validate & escape
const email = sanitizer.isValidEmail(email)
const escaped = sanitizer.escapeHTML(userText)

// Extract only numbers
const digits = sanitizer.extractNumbers(userPhone)
```

**All Validation Functions:**
```typescript
sanitizer.isValidEmail(email)        // RFC 5322 compliant
sanitizer.isValidPhone(phone)        // US format validation
sanitizer.isValidURL(url)            // Safe URL parsing
sanitizer.escapeHTML(text)           // Encode HTML entities
sanitizer.sanitizeHTML(input)        // Remove dangerous tags
```

### 4. CSRF Protection

**Stateless CSRF Tokens:**
```typescript
import { csrfProtection } from '../utils/security'

// On page load, get and store CSRF token
const token = csrfProtection.generateToken()
csrfProtection.storeCSRFToken(token)

// Add to request headers
const headers = csrfProtection.addCSRFHeader({
  'Content-Type': 'application/json',
})

// Send with mutation requests
await fetch('/api/transactions/send', {
  method: 'POST',
  headers,
  body: JSON.stringify(data),
})
```

**Production Checklist:**
- [ ] Validate CSRF token on backend for state-changing requests (POST, PUT, DELETE)
- [ ] Use SameSite=Strict cookie attribute
- [ ] Implement double-submit cookie pattern
- [ ] Rotate tokens after use

### 5. Secure Headers

Generate recommended security headers for backend:

```typescript
import { secureHeaders } from '../utils/security'

const headers = secureHeaders.getRecommendedHeaders()
// Returns Content-Security-Policy, X-Frame-Options, etc.

// Check if using HTTPS
if (secureHeaders.isSecureConnection()) {
  // Safe to transmit sensitive data
}
```

**Recommended Headers for Nginx/Express:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### 6. Two-Factor Authentication Setup

```typescript
import { twoFactorAuth } from '../utils/security'

// Generate QR code for TOTP setup
const qrUri = twoFactorAuth.generateQRCodeURI(userEmail)
// Display in QR code generator

// On subsequent logins
const isValid = twoFactorAuth.verify2FACode(userCode)
```

---

## ♿ Accessibility (WCAG 2.1 AA) Implementation

### 1. ARIA Labels & Roles

**Button Component:**
```jsx
<Button
  ariaLabel="Send money to recipient"
  ariaDescribedBy="send-help-text"
  onClick={handleSend}
>
  💸 Send Money
</Button>

<p id="send-help-text">Enter recipient email and amount</p>
```

**Modal Dialog:**
```jsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Transaction"
  // Automatically sets:
  // - role="dialog"
  // - aria-modal="true"
  // - aria-labelledby="modal-title"
  // - Traps focus within modal
  // - Announces to screen readers
>
  <p>Confirm sending $50 to john@example.com</p>
</Modal>
```

### 2. Keyboard Navigation

All components support keyboard activation:

- **Tab Key**: Navigate through interactive elements
- **Space/Enter**: Activate buttons
- **Escape**: Close modals and dropdowns
- **Arrow Keys**: Navigate lists and tabs

**Example - Enhanced Button:**
```jsx
// Button automatically handles:
// - Focus ring (focus:ring-2 focus:ring-offset-2)
// - Space/Enter activation
// - Disabled state
// - Loading state announcement to screen readers
<Button onClick={handleClick}>Action</Button>
```

### 3. Focus Management

**Manual Focus Control:**
```typescript
import { focusManager } from '../utils/accessibility'

// Move focus to element
focusManager.focus('modal-close-button')

// Navigate to next/previous focusable element
focusManager.focusNext(currentElement)
focusManager.focusPrevious(currentElement)

// Trap focus in modal
focusManager.trapFocus(modalContainer, keyboardEvent)

// Announce to screen readers
focusManager.announce('Transaction completed successfully', 'polite')
focusManager.announce('Error: Invalid amount', 'assertive')
```

### 4. Screen Reader Support

**Visually Hidden Text for Screen Readers:**

Add this CSS class to your stylesheet:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
}
```

**Usage:**
```jsx
<span className="sr-only">
  Your account balance is $1,234.56
</span>

// Screen readers will announce: "Your account balance is $1,234.56"
// But visually, the balance is displayed separately with formatting
```

### 5. Color Contrast Validation

**WCAG AA Standard: 4.5:1 for normal text, 3:1 for large text**

Check during development:
```typescript
import { contrast } from '../utils/accessibility'

const ratio = contrast.getContrastRatio('#333333', '#ffffff')
// Returns 12.63

const meetsAA = contrast.meetsWCAG_AA('#666666', '#ffffff')
// Returns true (ratio >= 4.5)

const meetsAAA = contrast.meetsWCAG_AAA('#666666', '#ffffff')
// Returns false (ratio < 7)
```

**Tailwind Colors That Meet WCAG AA:**
- ✓ Text: `text-gray-900` on `bg-white`
- ✓ Text: `text-blue-600` on `bg-white`
- ✓ Text: `text-white` on `bg-blue-600`
- ✗ Text: `text-gray-400` on `bg-white` (only 7:1 - need 4.5)

### 6. Semantic HTML

Proper heading hierarchy:
```jsx
<h1>Stitch Dashboard</h1>          {/* Page title */}
<h2>Recent Transactions</h2>       {/* Section heading */}
<h3>Transaction Details</h3>       {/* Subsection */}

// NOT: <h1>Dashboard</h1><h3>Details</h3>
```

Landmark regions:
```jsx
<header role="banner">Navigation</header>
<main role="main">Content</main>
<aside role="complementary">Sidebar</aside>
<footer role="contentinfo">Footer</footer>
```

---

## 📋 Testing & Validation

### Automated A11y Testing

```typescript
import { a11yTesting } from '../utils/accessibility'

// Check for missing image alt text
const { missing, present } = a11yTesting.checkImageAltText()
console.log(`Missing alt text: ${missing.length}`)

// Check heading hierarchy
const isValid = a11yTesting.checkHeadingHierarchy()

// Generate full report
a11yTesting.reportAccessibilityIssues()
```

### Browser Testing Tools

- **axe DevTools** - Chrome/Firefox extension for automated a11y scanning
- **WAVE** - WebAIM Accessibility Evaluation Tool
- **NVDA** - Free screen reader (Windows)
- **JAWS** - Premium screen reader (Windows, Mac, Linux)
- **VoiceOver** - Built-in screen reader (Mac, iOS)
- **Lighthouse** - Chrome DevTools built-in a11y audit

### Manual Testing Checklist

- [ ] Navigate entire app using only Tab key
- [ ] Close modals with Escape key
- [ ] Activate buttons with Space/Enter
- [ ] Verify all form fields have labels
- [ ] Check color contrast with axe DevTools
- [ ] Test with Chromatic screen reader
- [ ] Verify focus indicators visible
- [ ] Test resize browser to 200% zoom
- [ ] Test with mobile screen readers
- [ ] Verify image alt text descriptive

---

## 🔐 Security Best Practices Checklist

### Frontend Security

- [ ] Use HTTPS only (check with `secureHeaders.isSecureConnection()`)
- [ ] Sanitize all user inputs (`sanitizer` utilities)
- [ ] Escape HTML output (`sanitizer.escapeHTML()`)
- [ ] Validate email/phone format
- [ ] Implement CSRF tokens
- [ ] Store sensitive tokens securely
- [ ] Clear tokens on logout
- [ ] Set Content-Security-Policy headers
- [ ] Use subresource integrity (SRI) for CDN assets
- [ ] Keep dependencies updated

### Backend Requirements

- [ ] Hash passwords with bcryptjs (10+ salt rounds)
- [ ] Validate CSRF tokens on POST/PUT/DELETE
- [ ] Implement rate limiting
- [ ] Use prepared statements for SQL queries
- [ ] Validate input on backend (never trust client)
- [ ] Implement API authentication
- [ ] Use environment variables for secrets
- [ ] Log security events
- [ ] Implement 2FA
- [ ] SSL/TLS encryption

### API Security

- [ ] Use JWT with short expiration times
- [ ] Implement refresh token rotation
- [ ] CORS whitelist on backend
- [ ] Set httpOnly, Secure flags on cookies
- [ ] Implement request signing
- [ ] Rate limit by IP and user
- [ ] Add request validation on backend
- [ ] Log all API access
- [ ] Monitor for suspicious patterns

---

## 📚 Next Steps: Phase 3

After Phase 2, consider:

1. **Performance Optimization**
   - Code splitting with React.lazy
   - Bundle analysis and optimization
   - Image optimization
   - Caching strategies

2. **Monitoring & Analytics**
   - Error tracking (Sentry)
   - Performance monitoring (LogRocket)
   - User analytics
   - Security event logging

3. **Advanced Features**
   - Dark mode support
   - PWA capabilities
   - Push notifications
   - Offline mode

4. **Backend Integration**
   - Replace mock APIs with real endpoints
   - Database integration
   - Authentication service
   - Payment processing

---

## 📖 Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Auth0 Security Best Practices](https://auth0.com/docs/security)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
