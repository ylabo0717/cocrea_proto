"use client";

import { useEffect } from "react";
import { UsersList } from "./components/users-list";
import { useUsers } from "./hooks/use-users";

export default function UsersPage() {
  const { users, isLoading, refreshUsers } = useUsers();

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

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