import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Message, ModelId, TokenUsage } from '@/types';
import { SYSTEM_PROMPT_DEFAULT } from '@/types';
import { createConversation, generateId } from './utils';

interface ChatStore {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  isStreaming: boolean;
  totalTokensUsed: TokenUsage;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;

  // Actions
  setActiveConversation: (id: string) => void;
  createNewConversation: (model?: ModelId) => string;
  deleteConversation: (id: string) => void;
  updateSystemPrompt: (conversationId: string, prompt: string) => void;
  setModel: (conversationId: string, model: ModelId) => void;
  sendMessage: (content: string, images?: string[]) => Promise<void>;
  stopStreaming: () => void;
  addTokenUsage: (usage: TokenUsage) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  renameConversation: (id: string, title: string) => void;

  // Internal
  _abortController: AbortController | null;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      totalTokensUsed: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      theme: 'dark',
      sidebarOpen: true,
      _abortController: null,

      setActiveConversation: (id) => set({ activeConversationId: id }),

      createNewConversation: (model?: ModelId) => {
        const conv = createConversation(model || 'mimo-v2.5-pro', SYSTEM_PROMPT_DEFAULT);
        set((state) => ({
          conversations: [conv, ...state.conversations],
          activeConversationId: conv.id,
        }));
        return conv.id;
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const newActive =
            state.activeConversationId === id
              ? filtered[0]?.id || null
              : state.activeConversationId;
          return { conversations: filtered, activeConversationId: newActive };
        });
      },

      updateSystemPrompt: (conversationId, prompt) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, systemPrompt: prompt, updatedAt: Date.now() }
              : c,
          ),
        }));
      },

      setModel: (conversationId, model) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, model, updatedAt: Date.now() } : c,
          ),
        }));
      },

      sendMessage: async (content, images?) => {
        const { activeConversationId, conversations } = get();
        if (!activeConversationId) return;

        const conversation = conversations.find((c) => c.id === activeConversationId);
        if (!conversation) return;

        // Create user message
        const userMessage: Message = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: Date.now(),
          images,
        };

        // Create placeholder assistant message
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        };

        // Update conversation with user message and placeholder
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  messages: [...c.messages, userMessage, assistantMessage],
                  title:
                    c.messages.length === 0 ||
                    (c.systemPrompt ? c.messages.length === 1 : c.messages.length === 0)
                      ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                      : c.title,
                  updatedAt: Date.now(),
                }
              : c,
          ),
          isStreaming: true,
        }));

        // Build messages for API
        const apiMessages: { role: string; content: string | { type: string; text?: string; image_url?: { url: string } }[] }[] = [];

        if (conversation.systemPrompt) {
          apiMessages.push({ role: 'system', content: conversation.systemPrompt });
        }

        for (const msg of [...conversation.messages, userMessage]) {
          if (msg.role === 'system') continue; // Already added system prompt
          if (msg.images && msg.images.length > 0) {
            const parts: { type: string; text?: string; image_url?: { url: string } }[] = [
              { type: 'text', text: msg.content },
              ...msg.images.map((img) => ({
                type: 'image_url' as const,
                image_url: { url: img },
              })),
            ];
            apiMessages.push({ role: msg.role, content: parts });
          } else {
            apiMessages.push({ role: msg.role, content: msg.content });
          }
        }

        // Dynamically import to avoid SSR issues
        const { streamChat } = await import('./mimo-api');

        const abortController = new AbortController();
        set({ _abortController: abortController });

      try {
  let fullContent = '';

  for await (const chunk of streamChat(apiMessages as any, conversation.model)) {
    fullContent += String(chunk?.text || '');

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMessage.id
                  ? {
                      ...m,
                      content: fullContent,
                    }
                  : m,
              ),
            }
          : c,
      ),
    }));

    if (chunk?.usage) {
      set((state) => ({
        totalTokensUsed: {
          promptTokens:
            state.totalTokensUsed.promptTokens +
            chunk.usage.promptTokens,

          completionTokens:
            state.totalTokensUsed.completionTokens +
            chunk.usage.completionTokens,

          totalTokens:
            state.totalTokensUsed.totalTokens +
            chunk.usage.totalTokens,
        },
      }));
    }
  }

  // final update
  set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === activeConversationId
        ? {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    content: fullContent,
                  }
                : m,
            ),
          }
        : c,
    ),
  }));
} catch (error) {
  set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === activeConversationId
        ? {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMessage.id
                ? {
                    ...m,
                    content: `Error: ${
                      error instanceof Error
                        ? error.message
                        : 'Unknown error'
                    }`,
                  }
                : m,
            ),
          }
        : c,
    ),
  }));
} finally {
  set({
    isStreaming: false,
    _abortController: null,
  });
}

            if (chunk.usage) {
              set((state) => ({
                totalTokensUsed: {
                  promptTokens: state.totalTokensUsed.promptTokens + chunk.usage!.promptTokens,
                  completionTokens:
                    state.totalTokensUsed.completionTokens + chunk.usage!.completionTokens,
                  totalTokens: state.totalTokensUsed.totalTokens + chunk.usage!.totalTokens,
                },
              }));
            }
          }

          // Update final token count on the assistant message
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === activeConversationId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: fullContent }
                        : m,
                    ),
                  }
                : c,
            ),
          }));
        } catch (error) {
          // Set error in assistant message
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === activeConversationId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessage.id
                        ? {
                            ...m,
                            content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                          }
                        : m,
                    ),
                  }
                : c,
            ),
          }));
        } finally {
          set({ isStreaming: false, _abortController: null });
        }
      },

      stopStreaming: () => {
        const { _abortController } = get();
        if (_abortController) {
          _abortController.abort();
        }
        set({ isStreaming: false, _abortController: null });
      },

      addTokenUsage: (usage) => {
        set((state) => ({
          totalTokensUsed: {
            promptTokens: state.totalTokensUsed.promptTokens + usage.promptTokens,
            completionTokens: state.totalTokensUsed.completionTokens + usage.completionTokens,
            totalTokens: state.totalTokensUsed.totalTokens + usage.totalTokens,
          },
        }));
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
          ),
        }));
      },
    }),
    {
      name: 'mimo-chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        totalTokensUsed: state.totalTokensUsed,
        theme: state.theme,
      }),
    },
  ),
);
