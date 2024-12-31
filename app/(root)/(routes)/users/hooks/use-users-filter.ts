"use client";

import { useState, useCallback, useMemo } from "react";
import { User } from "@/lib/types";

interface Filters {
  name: string;
  email: string;
  department: string;
  role: string;
}

export function useUsersFilter(users: User[]) {
  const [filters, setFilters] = useState<Filters>({
    name: "",
    email: "",
    department: "",
    role: "",
  });

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(filters.email.toLowerCase());
      const departmentMatch = !filters.department || 
        (user.department?.toLowerCase().includes(filters.department.toLowerCase()) ?? false);
      const roleMatch = !filters.role || user.role === filters.role;

      return nameMatch && emailMatch && departmentMatch && roleMatch;
    });
  }, [users, filters]);

  return {
    filters,
    filteredUsers,
    handleFilterChange,
  };
}