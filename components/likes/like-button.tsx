"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createLike, deleteLike, getLikeCount, hasLiked } from "@/lib/api/likes";

interface LikeButtonProps {
  contentId: string;
}

export function LikeButton({ contentId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const loadLikeStatus = async () => {
      try {
        const [liked, count] = await Promise.all([
          hasLiked(contentId),
          getLikeCount(contentId)
        ]);
        if (mounted) {
          setIsLiked(liked);
          setLikeCount(count);
        }
      } catch (error) {
        console.error("Error loading like status:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadLikeStatus, 1000 * retryCount); // Exponential backoff
        }
      }
    };

    loadLikeStatus();

    return () => {
      mounted = false;
    };
  }, [contentId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLiked) {
        await deleteLike(contentId);
        setLikeCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        await createLike(contentId);
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Like operation failed:', error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "操作に失敗しました",
        variant: "destructive",
      });
      // エラー時は状態を元に戻す
      const [liked, count] = await Promise.all([
        hasLiked(contentId),
        getLikeCount(contentId)
      ]);
      setIsLiked(liked);
      setLikeCount(count);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={`gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likeCount}</span>
    </Button>
  );
}