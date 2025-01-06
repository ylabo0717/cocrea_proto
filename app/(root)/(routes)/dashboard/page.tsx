import { Suspense } from 'react'
import { ApplicationsData } from './components/applications-data'
import { CreateApplicationDialog } from '@/components/applications/create-application-dialog'
import { Skeleton } from '@/components/ui/skeleton'

export default async function DashboardPage() {
  return (
    <div className="h-full p-4 space-y-4 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">社内アプリケーションの開発状況を一覧で確認できます</p>
        </div>
        <CreateApplicationDialog />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <ApplicationsData />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[200px] bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  )
}
