"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";

export function CreateRequestButton() {
  const { userId, isLoading } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  if (isLoading || !userId) {
    return null;
  }

  const handleCreate = () => {
    router.push('/contents/new?type=request');
  };

  return (
    <Button className="gap-2" onClick={handleCreate}>
      <Plus className="h-4 w-4" />
      新規作成
    </Button>
  );
}