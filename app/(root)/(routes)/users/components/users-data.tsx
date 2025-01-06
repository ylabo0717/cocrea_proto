import { fetchUsers } from '@/app/actions/users'
import { UsersList } from './users-list'

export async function UsersData() {
  const users = await fetchUsers()

  return (
    <UsersList 
      users={users}
      isLoading={false}
    />
  )
}
