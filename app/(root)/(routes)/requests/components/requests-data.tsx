import { fetchRequests } from '@/app/actions/requests'
import { RequestsList } from './requests-list'
import { ViewToggle } from '@/components/view-toggle'
import { useState } from 'react'
import { RequestsFilter } from './requests-filter'
import { useRequestsFilter } from '../hooks/use-requests-filter'

export async function RequestsData() {
  const requests = await fetchRequests()

  return (
    <ClientRequests initialRequests={requests} />
  )
}

'use client'

function ClientRequests({ initialRequests }: { initialRequests: Content[] }) {
  const [view, setView] = useState<"grid" | "table">("grid")
  const {
    filters,
    handleStatusFilterChange,
    handlePriorityFilterChange,
    handleApplicationFilterChange,
  } = useRequestsFilter(initialRequests)

  return (
    <>
      <div className="flex items-center gap-4">
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      <div className="py-2">
        <RequestsFilter
          statuses={filters.statuses}
          priorities={filters.priorities}
          applicationId={filters.applicationId}
          onStatusChange={handleStatusFilterChange}
          onPriorityChange={handlePriorityFilterChange}
          onApplicationChange={handleApplicationFilterChange}
        />
      </div>
      <RequestsList 
        requests={initialRequests}
        isLoading={false}
        view={view}
      />
    </>
  )
}
