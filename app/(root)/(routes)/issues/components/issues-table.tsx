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
import { IssueStatusBadge } from "../[issueId]/components/issue-status-badge";
import { IssuePriorityBadge } from "../[issueId]/components/issue-priority-badge";
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
                <IssueStatusBadge status={issue.status} />
              </TableCell>
              <TableCell>
                <IssuePriorityBadge priority={issue.priority} />
              </TableCell>
              <TableCell>{(issue as any).application.name}</TableCell>
              <TableCell>{(issue as any).author.name}</TableCell>
              <TableCell>
                {format(new Date(issue.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}