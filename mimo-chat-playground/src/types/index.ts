export type ModelId = 'mimo-v2.5-pro' | 'mimo-v2.5';

export interface ModelInfo {
  id: ModelId;
  name: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
}

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
  tokenCount?: number;
  images?: string[]; // base64 image data for multi-modal
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  systemPrompt: string;
  model: ModelId;
  createdAt: number;
  updatedAt: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ChatRequest {
  messages: { role: string; content: string | ContentPart[] }[];
  model: string;
  stream: boolean;
  max_tokens?: number;
  temperature?: number;
}

export interface ContentPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

export const MODELS: Record<ModelId, ModelInfo> = {
  'mimo-v2.5-pro': {
    id: 'mimo-v2.5-pro',
    name: 'MiMo-V2.5-Pro',
    description: '万亿参数 MoE，深度适配 Agent 与 Coding，百万上下文',
    maxTokens: 8192,
    contextWindow: 1000000,
  },
  'mimo-v2.5': {
    id: 'mimo-v2.5',
    name: 'MiMo-V2.5',
    description: '原生多模态，支持文本、图像、视频和音频理解',
    maxTokens: 4096,
    contextWindow: 1000000,
  },
};

export const SYSTEM_PROMPT_DEFAULT =
  'You are a helpful AI assistant powered by Xiaomi MiMo. Answer questions accurately and concisely.';
