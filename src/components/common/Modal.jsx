import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { focusManager, keyboardNav } from '../../utils/accessibility'

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // Store currently focused element to restore later
      previousActiveElement.current = document.activeElement

      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Move focus to modal after render
      setTimeout(() => {
        if (modalRef.current) {
          focusManager.focus('modal-close-button')
          focusManager.announce(`${title} dialog opened`)
        }
      }, 50)
    } else {
      document.body.style.overflow = 'unset'
      // Restore focus to previously focused element
      previousActiveElement.current?.focus()
    }

    const handleEscape = (e) => {
      if (keyboardNav.isEscapeKey(e) && isOpen) {
        onClose()
      }
    }

    const handleKeyDown = (e) => {
      if (isOpen && modalRef.current) {
        focusManager.trapFocus(modalRef.current, e)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, title])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="presentation"
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        id="modal-container"
        className={`${sizes[size]} w-full bg-white rounded-2xl shadow-2xl animate-slide-down focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          <button
            id="modal-close-button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Close dialog"
            title="Close (Escape)"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div id="modal-description" className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal