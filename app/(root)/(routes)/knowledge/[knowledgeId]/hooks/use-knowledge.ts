"use client";

import { useState, useCallback } from "react";
import { Content } from "@/lib/types";
import { fetchKnowledgeById } from "@/lib/api/knowledge";
import { useToast } from "@/hooks/use-toast";

export function useKnowledge(knowledgeId: string) {
  const [knowledge, setKnowledge] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadKnowledge = useCallback(async () => {
    try {
      const fetchedKnowledge = await fetchKnowledgeById(knowledgeId);
      setKnowledge(fetchedKnowledge);
    } catch (error) {
      toast({
        title: "エラー",
        description: "ナレッジの読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [knowledgeId, toast]);

  return {
    knowledge,
    isLoading,
    refreshKnowledge: loadKnowledge,
  };
}