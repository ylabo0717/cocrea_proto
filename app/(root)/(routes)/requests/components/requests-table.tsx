"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Content } from "@/lib/types";
import { RequestStatusBadge } from "./request-status-badge";
import { RequestPriorityBadge } from "./request-priority-badge";
import { User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

interface RequestsTableProps {
  requests: Content[];
}

export function RequestsTable({ requests }: RequestsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>優先度</TableHead>
            <TableHead>アプリケーション</TableHead>
            <TableHead>作成者</TableHead>
            <TableHead>担当者</TableHead>
            <TableHead>作成日時</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Link 
                  href={`/requests/${request.id}`}
                  className="hover:underline text-primary"
                >
                  {request.title}
                </Link>
              </TableCell>
              <TableCell>
                <RequestStatusBadge status={request.status!} />
              </TableCell>
              <TableCell>
                <RequestPriorityBadge priority={request.priority!} />
              </TableCell>
              <TableCell>{(request as any).application.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {(request as any).author.name}
                </div>
              </TableCell>
              <TableCell>
                {(request as any).assignee && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {(request as any).assignee.name}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(request.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}