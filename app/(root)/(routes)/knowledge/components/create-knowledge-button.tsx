"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";

export function CreateKnowledgeButton() {
  const { userId, isLoading } = useSession();

  if (isLoading || !userId) {
    return null;
  }

  return (
    <Link href="/knowledge/new">
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        新規作成
      </Button>
    </Link>
  );
}