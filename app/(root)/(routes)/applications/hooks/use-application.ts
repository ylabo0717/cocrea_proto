import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Application } from "./use-applications";

export function useApplication(applicationId: string) {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchApplication = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications/${applicationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch application");
      }
      const data = await response.json();
      setApplication(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "アプリケーションの取得に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, toast]);

  const updateApplication = useCallback(async (updatedApplication: Application) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedApplication),
      });
      if (!response.ok) {
        throw new Error("Failed to update application");
      }
      toast({
        title: "更新完了",
        description: "アプリケーションを更新しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "アプリケーションの更新に失敗しました",
        variant: "destructive",
      });
      throw error;
    }
  }, [applicationId, toast]);

  return {
    application,
    isLoading,
    fetchApplication,
    updateApplication,
  };
}
