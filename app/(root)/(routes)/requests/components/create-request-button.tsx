"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateRequestButton() {
  return (
    <Link href="/requests/new">
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        新規作成
      </Button>
    </Link>
  );
}