import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Application {
  id: string;
  name: string;
  description: string;
  settings: any;
  createdAt: string;
  status: string;
  progress: number;
  next_release_date?: string;
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "アプリケーションの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    applications,
    isLoading,
    refreshApplications,
  };
}
