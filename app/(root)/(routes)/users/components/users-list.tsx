"use client";

import { User } from "@/lib/types";
import { UsersTable } from "./users-table";
import { UsersFilter } from "./users-filter";
import { useState } from "react";

interface UsersListProps {
  users: User[];
  isLoading: boolean;
}

export function UsersList({ users, isLoading }: UsersListProps) {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    department: "",
    role: ""
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(filters.email.toLowerCase());
    const departmentMatch = !filters.department || 
      (user.department?.toLowerCase().includes(filters.department.toLowerCase()) ?? false);
    const roleMatch = !filters.role || user.role === filters.role;

    return nameMatch && emailMatch && departmentMatch && roleMatch;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
        <div className="h-20 w-full bg-muted animate-pulse rounded" />
        <div className="h-20 w-full bg-muted animate-pulse rounded" />
        <div className="h-20 w-full bg-muted animate-pulse rounded" />
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