"use client";

import { User } from "@/lib/types";
import { UsersTable } from "./users-table";
import { Skeleton } from "@/components/ui/skeleton";

interface UsersListProps {
  users: User[];
  isLoading: boolean;
}

export function UsersList({ users, isLoading }: UsersListProps) {
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

  return <UsersTable users={users} />;
}