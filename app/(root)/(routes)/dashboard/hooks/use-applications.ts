"use client";

import { useState, useCallback } from 'react';
import { Application } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadApplications = useCallback(async () => {
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) {
        throw new Error('アプリケーションの取得に失敗しました');
      }
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "アプリケーションの読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    applications,
    isLoading,
    refreshApplications: loadApplications
  };
}