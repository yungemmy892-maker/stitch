/**
 * Accessibility (A11y) Utilities
 * Provides helpers for ARIA labels, keyboard navigation, focus management,
 * screen reader support, and semantic markup
 */

// ============================================================================
// ARIA Label Generators
// ============================================================================

export const ariaLabels = {
  /**
   * Generate ARIA label for button based on state
   */
  buttonLabel(action: string, state?: 'loading' | 'disabled' | 'error'): string {
    const stateText = state ? ` (${state})` : ''
    return `${action}${stateText}`
  },

  /**
   * Generate ARIA live region announcement
   */
  liveAnnouncement(message: string, polite = true): string {
    return `${message}${polite ? '' : ' - urgent'}`
  },

  /**
   * Generate label for form input with validation state
   */
  formInputLabel(fieldName: string, required = false, error?: string): string {
    const requiredText = required ? ' (required)' : ''
    const errorText = error ? `. Error: ${error}` : ''
    return `${fieldName}${requiredText}${errorText}`
  },

  /**
   * Generate ARIA describedby for inputs with help text
   */
  describedBy(inputId: string, hasHint: boolean, hasError: boolean): string {
    const ids: string[] = []
    if (hasHint) ids.push(`${inputId}-hint`)
    if (hasError) ids.push(`${inputId}-error`)
    return ids.length > 0 ? ids.join(' ') : ''
  },
}

// ============================================================================
// Keyboard Navigation Helpers
// ============================================================================

export const keyboardNav = {
  /**
   * Check if key is Enter or Space (for button activation)
   */
  isActivationKey(event: KeyboardEvent): boolean {
    return event.key === 'Enter' || event.key === ' '
  },

  /**
   * Check if key is Escape
   */
  isEscapeKey(event: KeyboardEvent): boolean {
    return event.key === 'Escape'
  },

  /**
   * Check if key is arrow key
   */
  isArrowKey(event: KeyboardEvent): boolean {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
  },

  /**
   * Get arrow key direction
   */
  getArrowDirection(
    event: KeyboardEvent
  ): 'up' | 'down' | 'left' | 'right' | null {
    const map: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    return map[event.key] || null
  },

  /**
   * Check if modifier keys are pressed
   */
  hasModifier(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
  },

  /**
   * Prevent default if key is handled
   */
  handleKeyboard(event: KeyboardEvent, handler: () => void): void {
    if (keyboardNav.isActivationKey(event)) {
      event.preventDefault()
      handler()
    }
  },
}

// ============================================================================
// Focus Management
// ============================================================================

export const focusManager = {
  /**
   * Focus element by ID
   */
  focus(elementId: string): void {
    const element = document.getElementById(elementId)
    if (element) {
      element.focus()
    }
  },

  /**
   * Move focus to next focusable element
   */
  focusNext(currentElement: HTMLElement): void {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    const currentIndex = focusableElements.indexOf(currentElement)
    const nextIndex = currentIndex + 1
    if (nextIndex < focusableElements.length) {
      focusableElements[nextIndex].focus()
    }
  },

  /**
   * Move focus to previous focusable element
   */
  focusPrevious(currentElement: HTMLElement): void {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    const currentIndex = focusableElements.indexOf(currentElement)
    const previousIndex = currentIndex - 1
    if (previousIndex >= 0) {
      focusableElements[previousIndex].focus()
    }
  },

  /**
   * Trap focus within element (for modals)
   */
  trapFocus(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== 'Tab') return

    const focusableElements = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement as HTMLElement

    if (event.shiftKey) {
      // Shift+Tab
      if (activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  },

  /**
   * Announce to screen readers
   */
  announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', politeness)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only' // Visually hidden
    announcement.textContent = message
    document.body.appendChild(announcement)

    // Clean up after announcement is read
    setTimeout(() => {
      announcement.remove()
    }, 1000)
  },
}

// ============================================================================
// Color Contrast Validation
// ============================================================================

export const contrast = {
  /**
   * Calculate relative luminance for WCAG contrast calculation
   */
  getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)

    if (!rgb1 || !rgb2) return 0

    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b)
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b)

    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)

    return (lighter + 0.05) / (darker + 0.05)
  },

  /**
   * Check if contrast ratio meets WCAG AA standard (4.5:1 for normal text)
   */
  meetsWCAG_AA(color1: string, color2: string): boolean {
    return this.getContrastRatio(color1, color2) >= 4.5
  },

  /**
   * Check if contrast ratio meets WCAG AAA standard (7:1 for normal text)
   */
  meetsWCAG_AAA(color1: string, color2: string): boolean {
    return this.getContrastRatio(color1, color2) >= 7
  },

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  },
}

// ============================================================================
// Screen Reader Utilities
// ============================================================================

export const screenReader = {
  /**
   * Create visually hidden element (screen reader only)
   * Use this class in your CSS:
   * .sr-only {
   *   position: absolute;
   *   width: 1px;
   *   height: 1px;
   *   overflow: hidden;
   *   clip: rect(1px, 1px, 1px, 1px);
   * }
   */
  createHiddenLabel: (text: string, forId: string): HTMLElement => {
    const label = document.createElement('label')
    label.htmlFor = forId
    label.className = 'sr-only'
    label.textContent = text
    return label
  },

  /**
   * Announce total count or progress to screen readers
   */
  announceCount(current: number, total: number): string {
    return `${current} of ${total}`
  },

  /**
   * Announce loading state
   */
  announceLoading(componentName: string): string {
    return `Loading ${componentName}`
  },

  /**
   * Announce error state
   */
  announceError(fieldName: string, errorMessage: string): string {
    return `Error in ${fieldName}: ${errorMessage}`
  },
}

// ============================================================================
// Semantic HTML Helpers
// ============================================================================

export const semanticHTML = {
  /**
   * Get appropriate heading level based on hierarchy
   */
  getHeadingLevel(
    level: 1 | 2 | 3 | 4 | 5 | 6
  ): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
    return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  },

  /**
   * Get semantic button type
   */
  getButtonType(action: 'submit' | 'reset' | 'action'): string {
    const map: Record<string, string> = {
      submit: 'submit',
      reset: 'reset',
      action: 'button',
    }
    return map[action] || 'button'
  },

  /**
   * Build semantic list structure
   */
  buildListItem(content: string, ariaLabel?: string): {
    role: string
    ariaLabel?: string
    children: string
  } {
    return {
      role: 'listitem',
      ariaLabel,
      children: content,
    }
  },

  /**
   * Get landmark role description
   */
  getLandmarkRole(
    type: 'main' | 'nav' | 'aside' | 'search' | 'contentinfo'
  ): string {
    const map: Record<string, string> = {
      main: 'main',
      nav: 'navigation',
      aside: 'complementary',
      search: 'search',
      contentinfo: 'contentinfo',
    }
    return map[type] || 'region'
  },
}

// ============================================================================
// Accessibility Testing Utilities
// ============================================================================

export const a11yTesting = {
  /**
   * Check if element is keyboard accessible
   */
  isKeyboardAccessible(element: HTMLElement): boolean {
    const tabIndex = element.getAttribute('tabIndex')
    const isNativelyFocusable = [
      'button',
      'a',
      'input',
      'select',
      'textarea',
    ].includes(element.tagName.toLowerCase())

    return isNativelyFocusable || (tabIndex !== null && parseInt(tabIndex) >= 0)
  },

  /**
   * Get all focusable elements in container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]
  },

  /**
   * Check for missing alt text on images
   */
  checkImageAltText(): { missing: HTMLImageElement[]; present: HTMLImageElement[] } {
    const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
    return {
      missing: images.filter((img) => !img.getAttribute('alt')),
      present: images.filter((img) => img.getAttribute('alt')),
    }
  },

  /**
   * Check for heading hierarchy issues
   */
  checkHeadingHierarchy(): boolean {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    let isValid = true
    let lastLevel = 0

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1])
      if (level > lastLevel + 1) {
        console.warn(`Heading hierarchy broken: jumped from H${lastLevel} to H${level}`)
        isValid = false
      }
      lastLevel = level
    })

    return isValid
  },

  /**
   * Report accessibility issues
   */
  reportAccessibilityIssues(): void {
    console.group('Accessibility Report')

    // Check images
    const imageCheck = this.checkImageAltText()
    if (imageCheck.missing.length > 0) {
      console.warn(`Found ${imageCheck.missing.length} images without alt text:`, imageCheck.missing)
    }

    // Check heading hierarchy
    if (!this.checkHeadingHierarchy()) {
      console.warn('Heading hierarchy issues detected')
    }

    // Check for color contrast (if using specific Tailwind colors)
    console.log(`✓ Found ${imageCheck.present.length} images with alt text`)

    console.groupEnd()
  },
}

export default {
  ariaLabels,
  keyboardNav,
  focusManager,
  contrast,
  screenReader,
  semanticHTML,
  a11yTesting,
}
