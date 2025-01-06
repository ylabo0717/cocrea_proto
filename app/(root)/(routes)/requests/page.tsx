import { Suspense } from 'react'
import { RequestsData } from './components/requests-data'
import { CreateRequestButton } from './components/create-request-button'
import { Skeleton } from '@/components/ui/skeleton'

export default async function RequestsPage() {
  return (
    <div className="h-full">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Requests</h2>
              <p className="text-muted-foreground">アプリケーションへの要望やアイデアを共有できます</p>
            </div>
            <CreateRequestButton />
          </div>
          
          <Suspense fallback={<RequestsSkeleton />}>
            <RequestsData />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function RequestsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    </div>
  )
}
