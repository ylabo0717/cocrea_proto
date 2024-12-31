"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UsersFilterProps {
  filters: {
    name: string;
    email: string;
    department: string;
    role: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function UsersFilter({ filters, onFilterChange }: UsersFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">名前</label>
        <Input
          placeholder="名前で検索"
          value={filters.name}
          onChange={(e) => onFilterChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">メールアドレス</label>
        <Input
          placeholder="メールアドレスで検索"
          value={filters.email}
          onChange={(e) => onFilterChange("email", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">部署</label>
        <Input
          placeholder="部署で検索"
          value={filters.department}
          onChange={(e) => onFilterChange("department", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">役割</label>
        <Select
          value={filters.role || "all"}
          onValueChange={(value) => onFilterChange("role", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="全て" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全て</SelectItem>
            <SelectItem value="admin">管理者</SelectItem>
            <SelectItem value="developer">開発者</SelectItem>
            <SelectItem value="user">一般ユーザー</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}