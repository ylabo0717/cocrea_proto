'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function CreateContentButton() {
  return (
    <Link href="/contents/new">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        新規作成
      </Button>
    </Link>
  );
}
