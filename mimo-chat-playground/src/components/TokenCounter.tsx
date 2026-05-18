'use client';

import { useChatStore } from '@/lib/store';
import { formatTokenCount } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

export default function TokenCounter() {
  const { totalTokensUsed } = useChatStore();
  const { totalTokens } = totalTokensUsed;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
      <BarChart3 className="w-3 h-3" />
      <span>
        已用 <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{formatTokenCount(totalTokens)}</span> tokens
      </span>
    </div>
  );
}
