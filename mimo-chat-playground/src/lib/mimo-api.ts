import type { ChatRequest, ModelId, ContentPart } from '@/types';
import { MODELS } from '@/types';

const MIMO_BASE_URL = process.env.NEXT_PUBLIC_MIMO_BASE_URL || 'https://api.xiaomimimo.com/v1';
const MIMO_API_KEY = process.env.NEXT_PUBLIC_MIMO_API_KEY || '';

interface StreamChunk {
  choices: {
    index: number;
    delta: { content?: string; role?: string };
    finish_reason: string | null;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function* streamChat(
  messages: { role: string; content: string | ContentPart[] }[],
  model: ModelId,
  options?: { temperature?: number; maxTokens?: number },
): AsyncGenerator<{ text: string; usage?: { promptTokens: number; completionTokens: number; totalTokens: number } }> {
  const request: ChatRequest = {
    messages,
    model: MODELS[model].name,
    stream: true,
    max_tokens: options?.maxTokens || MODELS[model].maxTokens,
    temperature: options?.temperature ?? 0.7,
  };

  const response = await fetch(`${MIMO_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MIMO_API_KEY}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`MiMo API error ${response.status}: ${errorBody}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed: StreamChunk = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;

          if (delta?.content) {
            yield {
              text: delta.content,
              usage: parsed.usage
                ? {
                    promptTokens: parsed.usage.prompt_tokens,
                    completionTokens: parsed.usage.completion_tokens,
                    totalTokens: parsed.usage.total_tokens,
                  }
                : undefined,
            };
          }
        } catch {
          // Skip unparseable chunks
        }
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      const data = buffer.trim().replace(/^data: /, '');
      if (data !== '[DONE]') {
        try {
          const parsed: StreamChunk = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.content) {
            yield {
              text: delta.content,
              usage: parsed.usage
                ? {
                    promptTokens: parsed.usage.prompt_tokens,
                    completionTokens: parsed.usage.completion_tokens,
                    totalTokens: parsed.usage.total_tokens,
                  }
                : undefined,
            };
          }
        } catch {
          // Skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
