"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createLike, deleteLike, getLikeCount, hasLiked } from "@/lib/api/likes";
import { useSession } from "@/hooks/use-session";

interface LikeButtonProps {
  contentId: string;
}

export function LikeButton({ contentId }: LikeButtonProps) {
  const { userId } = useSession();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadLikeStatus = async () => {
      try {
        const [liked, count] = await Promise.all([
          hasLiked(contentId),
          getLikeCount(contentId)
        ]);
        setIsLiked(liked);
        setLikeCount(count);
      } catch (error) {
        console.error("Error loading like status:", error);
      }
    };

    if (contentId) {
      loadLikeStatus();
    }
  }, [contentId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();

    if (!userId) {
      toast({
        title: "認証が必要です",
        description: "いいねするにはログインが必要です",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLiked) {
        await deleteLike(contentId);
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      } else {
        await createLike(contentId);
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "操作に失敗しました",
        variant: "destructive",
      });
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