"use client";

import { useState, useCallback } from "react";
import { Content } from "@/lib/types";
import { fetchRequests } from "@/lib/api/requests";
import { useToast } from "@/hooks/use-toast";

export function useRequests() {
  const [requests, setRequests] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRequests = useCallback(async () => {
    try {
      const data = await fetchRequests();
      setRequests(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "要望の読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    requests,
    isLoading,
    refreshRequests: loadRequests,
  };
}