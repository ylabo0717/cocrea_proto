"use client";

import { useState, useCallback } from "react";
import { Content } from "@/lib/types";
import { fetchIssues } from "@/lib/api/issues";
import { useToast } from "@/hooks/use-toast";

export function useIssues() {
  console.log('useIssues hook initialized at:', new Date().toISOString());
  
  const [issues, setIssues] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadIssues = useCallback(async () => {
    console.log('loadIssues called at:', new Date().toISOString());
    try {
      console.log('Fetching issues...');
      const fetchedIssues = await fetchIssues();
      console.log('Fetched issues:', fetchedIssues);
      setIssues(fetchedIssues);
    } catch (error) {
      console.error('Error in loadIssues:', error);
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
