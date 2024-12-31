"use client";

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('ログアウトに失敗しました');
      }

      router.push('/login');
      router.refresh();
    } catch (error) {
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'ログアウトに失敗しました',
        variant: 'destructive'
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="text-white hover:bg-gray-800"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}