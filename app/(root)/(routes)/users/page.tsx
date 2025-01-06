import { Suspense } from 'react'
import { UsersData } from './components/users-data'
import { Skeleton } from '@/components/ui/skeleton'

export default async function UsersPage() {
  return (
    <div className="h-full p-4 space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-foreground">ユーザー一覧</h2>
        <p className="text-muted-foreground">システムを利用しているユーザーの一覧です</p>
      </div>

      <Suspense fallback={<UsersSkeleton />}>
        <UsersData />
      </Suspense>
    </div>
  )
}

function UsersSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}
