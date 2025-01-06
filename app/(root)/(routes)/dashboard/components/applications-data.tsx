import { fetchApplications } from '@/app/actions/applications'
import { ApplicationsList } from './applications-list'
import { ApplicationsChart } from './applications-chart'

export async function ApplicationsData() {
  const applications = await fetchApplications()

  return (
    <>
      <ApplicationsChart applications={applications} />
      <ApplicationsList 
        applications={applications}
        isLoading={false}
        onUpdate={async () => {
          'use server'
          return fetchApplications()
        }}
      />
    </>
  )
}
