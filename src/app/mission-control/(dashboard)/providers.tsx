'use client'

import { ToastProvider } from '@/components/ui/Toast'
import { AlertProvider } from '@/components/ui/Alert'

export default function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AlertProvider>{children}</AlertProvider>
    </ToastProvider>
  )
}
