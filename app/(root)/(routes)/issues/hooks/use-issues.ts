"use client";

import { useState, useCallback } from "react";
import { Content } from "@/lib/types";
import { fetchIssues } from "@/lib/api/issues";
import { useToast } from "@/hooks/use-toast";

export function useIssues() {
  const [issues, setIssues] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadIssues = useCallback(async () => {
    try {
      const fetchedIssues = await fetchIssues();
      setIssues(fetchedIssues);
    } catch (error) {
      toast({
        title: "エラー",
        description: "課題の読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    issues,
    isLoading,
    refreshIssues: loadIssues,
  };
}