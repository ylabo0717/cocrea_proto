"use client";

import { User } from "@/lib/types";
import { UsersTable } from "./users-table";
import { UsersFilter } from "./users-filter";
import { useUsersFilter } from "../hooks/use-users-filter";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersListProps {
  users: User[];
  isLoading: boolean;
}

export function UsersList({ users, isLoading }: UsersListProps) {
  const { filters, filteredUsers, handleFilterChange } = useUsersFilter(users);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UsersFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <UsersTable users={filteredUsers} />
    </div>
  );
}