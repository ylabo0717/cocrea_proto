"use client";

import { useState, useCallback } from 'react';
import { Application } from '@/lib/types';
import { fetchApplications } from '@/lib/api/applications';
import { useToast } from '@/hooks/use-toast';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadApplications = useCallback(async () => {
    try {
      const apps = await fetchApplications();
      setApplications(apps);
    } catch (error) {
      toast({
        title: "エラー",
        description: "アプリケーションの読み込みに失敗しました",
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