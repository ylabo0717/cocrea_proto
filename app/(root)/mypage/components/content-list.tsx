'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { Content, ContentType } from "../actions";
import { contentTypeInfo } from "../constants";

interface ContentListProps {
  type: ContentType;
  contents: Content[];
}

export function ContentList({ type, contents }: ContentListProps) {
  if (!contents.length) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{contentTypeInfo[type].label}一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contents.map((content) => (
            <Link 
              key={content.id} 
              href={`${contentTypeInfo[content.type].path}/${content.id}`}
              className="block p-4 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{content.title}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {format(new Date(content.created_at), 'PPP', { locale: ja })}
                  </div>
                </div>
                {content.status && (
                  <Badge 
                    className={contentTypeInfo[content.type].statusColors[content.status as keyof typeof contentTypeInfo[typeof type]['statusColors']]}
                  >
                    {content.status === 'open' && '未対応'}
                    {content.status === 'in_progress' && '対応中'}
                    {content.status === 'resolved' && '解決済み'}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
