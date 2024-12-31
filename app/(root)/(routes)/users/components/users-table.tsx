"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/types";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理者';
      case 'developer':
        return '開発者';
      case 'user':
        return '一般ユーザー';
      default:
        return role;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名前</TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead>部署</TableHead>
            <TableHead>役割</TableHead>
            <TableHead>最終ログイン</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.department || "-"}</TableCell>
              <TableCell>{getRoleDisplay(user.role)}</TableCell>
              <TableCell>
                {user.last_login
                  ? new Date(user.last_login).toLocaleString("ja-JP")
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}