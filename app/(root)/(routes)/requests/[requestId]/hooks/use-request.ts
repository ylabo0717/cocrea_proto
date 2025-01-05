"use client";

import { useState, useCallback } from "react";
import { Content } from "@/lib/types";
import { fetchRequestById } from "@/lib/api/requests";
import { useToast } from "@/hooks/use-toast";

export function useRequest(requestId: string) {
  const [request, setRequest] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRequest = useCallback(async () => {
    try {
      const fetchedRequest = await fetchRequestById(requestId);
      setRequest(fetchedRequest);
    } catch (error) {
      toast({
        title: "エラー",
        description: "要望の読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [requestId, toast]);

  return {
    request,
    isLoading,
    refreshRequest: loadRequest,
  };
}