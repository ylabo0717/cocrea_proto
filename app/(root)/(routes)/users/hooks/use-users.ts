"use client";

import { useState, useCallback } from "react";
import { User } from "@/lib/types";
import { fetchUsers } from "@/lib/api/users";
import { useToast } from "@/hooks/use-toast";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        title: "エラー",
        description: "ユーザーの読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    users,
    isLoading,
    refreshUsers: loadUsers,
  };
}