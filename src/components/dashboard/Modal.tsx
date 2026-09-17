'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PiX } from 'react-icons/pi'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'max-w-2xl',
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div key="modal" className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`relative flex w-full ${maxWidth} max-h-[92vh] flex-col overflow-hidden rounded-t-3xl border border-dark/10 bg-white shadow-2xl sm:rounded-3xl`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-dark/10 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-center gap-3">
                {icon && (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-lime/20 text-xl text-dark">
                    {icon}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="truncate font-serif text-lg font-bold text-dark">{title}</h2>
                  {subtitle && <p className="mt-0.5 text-xs text-dark/50">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-dark/50 transition-colors hover:bg-dark/5 hover:text-dark"
              >
                <PiX className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">{children}</div>

            {footer && (
              <div className="border-t border-dark/10 bg-cream/70 px-5 py-4 sm:px-6">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
