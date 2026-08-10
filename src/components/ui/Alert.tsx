'use client'

import { useState, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PiWarning, PiInfo, PiTrash, PiX } from 'react-icons/pi'

type AlertIcon = 'warning' | 'danger' | 'info'

interface AlertOptions {
  title: string
  message: string
  icon?: AlertIcon
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
}

interface AlertContextValue {
  alert: (options: AlertOptions) => void
  confirm: (options: Omit<AlertOptions, 'cancelLabel'> & { onConfirm: () => void | Promise<void> }) => void
}

const AlertContext = createContext<AlertContextValue>({ alert: () => {}, confirm: () => {} })

export function useAlert() {
  return useContext(AlertContext)
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<(AlertOptions & { type: 'alert' | 'confirm' }) | null>(null)

  const alert = useCallback((options: AlertOptions) => {
    setConfig({ ...options, type: 'alert' })
  }, [])

  const confirm = useCallback((options: AlertOptions) => {
    setConfig({ ...options, type: 'confirm' })
  }, [])

  const close = () => setConfig(null)

  const handleConfirm = async () => {
    await config?.onConfirm()
    close()
  }

  const iconMap: Record<AlertIcon, React.ReactNode> = {
    warning: <PiWarning className="w-6 h-6 text-amber-500" />,
    danger: <PiTrash className="w-6 h-6 text-red-500" />,
    info: <PiInfo className="w-6 h-6 text-dark/60" />,
  }

  return (
    <AlertContext.Provider value={{ alert, confirm }}>
      {children}
      <AnimatePresence>
        {config && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            >
              <button onClick={close} className="absolute top-4 right-4 text-dark/40 hover:text-dark">
                <PiX className="w-5 h-5" />
              </button>
              <div className="flex items-start gap-4 mb-4">
                {iconMap[config.icon || 'warning']}
                <div>
                  <h3 className="font-serif text-lg font-bold text-dark">{config.title}</h3>
                  <p className="text-sm text-dark/60 mt-1">{config.message}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                {config.type === 'confirm' && (
                  <button onClick={close} className="px-5 py-2.5 rounded-xl border border-dark/15 text-sm font-semibold text-dark hover:bg-dark/5 transition-colors">
                    {config.cancelLabel || 'Cancel'}
                  </button>
                )}
                <button onClick={handleConfirm} className="px-5 py-2.5 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-dark/90 transition-colors">
                  {config.confirmLabel || 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  )
}
