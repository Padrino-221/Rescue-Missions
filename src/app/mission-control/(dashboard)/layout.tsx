import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'
import DashboardProviders from './providers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/mission-control/login')
  }

  return (
    <DashboardProviders>
      <div className="min-h-screen bg-cream flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
          <DashboardHeader session={session} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </DashboardProviders>
  )
}
