"use client";

import { useEffect, useState } from "react";
import { UsersList } from "./components/users-list";
import { fetchUsers } from "./actions";
import { User } from "@/lib/types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-foreground">ユーザー一覧</h2>
        <p className="text-muted-foreground">システムを利用しているユーザーの一覧です</p>
      </div>

      <UsersList users={users} isLoading={isLoading} />
    </div>
  );
}