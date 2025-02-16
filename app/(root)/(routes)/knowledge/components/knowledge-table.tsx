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
import { User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface KnowledgeTableProps {
  knowledgeList: Content[];
}

export function KnowledgeTable({ knowledgeList }: KnowledgeTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>アプリケーション</TableHead>
            <TableHead>作成者</TableHead>
            <TableHead>作成日時</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {knowledgeList.map((knowledge) => (
            <TableRow key={knowledge.id}>
              <TableCell>
                <Link 
                  href={`/knowledge/${knowledge.id}`}
                  className="hover:underline text-primary"
                >
                  {knowledge.title}
                </Link>
                {knowledge.tags && knowledge.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {knowledge.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>{(knowledge as any).application.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {(knowledge as any).author.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(knowledge.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}