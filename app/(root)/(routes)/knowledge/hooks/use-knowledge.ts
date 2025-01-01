"use client";

import { useState, useCallback } from "react";
import { Content } from "@/lib/types";
import { fetchKnowledge } from "@/lib/api/knowledge";
import { useToast } from "@/hooks/use-toast";

export function useKnowledge() {
  const [knowledgeList, setKnowledgeList] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadKnowledge = useCallback(async () => {
    try {
      const data = await fetchKnowledge();
      setKnowledgeList(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "ナレッジの読み込みに失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    knowledgeList,
    isLoading,
    refreshKnowledge: loadKnowledge,
  };
}