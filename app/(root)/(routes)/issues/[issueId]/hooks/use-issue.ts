"use client";

import { useState, useCallback, useEffect } from "react";
import { Content } from "@/lib/types";
import { fetchIssueById } from "@/lib/api/issues";
import { useToast } from "@/hooks/use-toast";

export function useIssue(issueId: string) {
  const [issue, setIssue] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadIssue = useCallback(async () => {
    if (!issueId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedIssue = await fetchIssueById(issueId);
      setIssue(fetchedIssue);
    } catch (error) {
      console.error('Failed to load issue:', error);
      setIssue(null);
      toast({
        title: "エラー",
        description: "課題の読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [issueId, toast]);

  useEffect(() => {
    loadIssue();
  }, [loadIssue]);

  return {
    issue,
    isLoading,
    refreshIssue: loadIssue,
  };
}