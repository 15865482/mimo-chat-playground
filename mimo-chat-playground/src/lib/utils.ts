import { v4 as uuidv4 } from 'uuid';
import type { Message, Conversation, ModelId } from '@/types';

export function generateId(): string {
  return uuidv4();
}

export function createConversation(model: ModelId, systemPrompt: string): Conversation {
  const now = Date.now();
  const systemMessage: Message = systemPrompt
    ? {
        id: generateId(),
        role: 'system',
        content: systemPrompt,
        timestamp: now,
      }
    : (undefined as unknown as Message);

  return {
    id: generateId(),
    title: '新对话',
    messages: systemPrompt ? [systemMessage] : [],
    systemPrompt,
    model,
    createdAt: now,
    updatedAt: now,
  };
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 chars per token for Chinese, ~4 chars per token for English
  // MiMo uses a multilingual tokenizer; we approximate
  let tokenCount = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code > 127) {
      // CJK characters: roughly 1-2 tokens each
      tokenCount += 1.5;
    } else if (char === ' ') {
      tokenCount += 1;
    } else {
      // English text: ~4 characters per token
      tokenCount += 0.25;
    }
  }
  return Math.ceil(tokenCount);
}

export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000_000) {
    return `${(tokens / 1_000_000_000).toFixed(1)}B`;
  }
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }
  return String(tokens);
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
