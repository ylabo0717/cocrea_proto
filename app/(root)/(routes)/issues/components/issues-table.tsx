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
import { IssueStatusBadge } from "./issue-status-badge";
import { IssuePriorityBadge } from "./issue-priority-badge";
import { User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";

interface IssuesTableProps {
  issues: Content[];
}

export function IssuesTable({ issues }: IssuesTableProps) {
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
          {issues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>
                <Link 
                  href={`/issues/${issue.id}`}
                  className="hover:underline text-primary"
                >
                  {issue.title}
                </Link>
              </TableCell>
              <TableCell>
                <IssueStatusBadge status={issue.status!} />
              </TableCell>
              <TableCell>
                <IssuePriorityBadge priority={issue.priority!} />
              </TableCell>
              <TableCell>{(issue as any).application.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {(issue as any).author.name}
                </div>
              </TableCell>
              <TableCell>
                {(issue as any).assignee && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {(issue as any).assignee.name}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(issue.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}