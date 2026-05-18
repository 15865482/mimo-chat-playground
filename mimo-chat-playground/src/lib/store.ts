sendMessage: async (content, images?) => {
  const { activeConversationId, conversations } = get();

  if (!activeConversationId) return;

  const conversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  if (!conversation) return;

  // user message
  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content,
    timestamp: Date.now(),
    images,
  };

  // assistant placeholder
  const assistantMessage: Message = {
    id: generateId(),
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
  };

  // update state
  set((state) => ({
    conversations: state.conversations.map((c) =>
      c.id === activeConversationId
        ? {
            ...c,
            messages: [...c.messages, userMessage, assistantMessage],
            title:
              c.messages.length === 0
                ? content.slice(0, 30) +
                  (content.length > 30 ? '...' : '')
                : c.title,
            updatedAt: Date.now(),
          }
        : c,
    ),
    isStreaming: true,
  }));

  // build api messages
  const apiMessages: any[] = [];

  if (conversation.systemPrompt) {
    apiMessages.push({
      role: 'system',
      content: conversation.systemPrompt,
    });
  }

  for (const msg of [...conversation.messages, userMessage]) {
    if (msg.role === 'system') continue;

    if (msg.images && msg.images.length > 0) {
      const parts = [
        {
          type: 'text',
          text: msg.content,
        },

        ...msg.images.map((img) => ({
          type: 'image_url',
          image_url: {
            url: img,
          },
        })),
      ];

      apiMessages.push({
        role: msg.role,
        content: parts,
      });
    } else {
      apiMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  // import api
  const { streamChat } = await import('./mimo-api');

  const abortController = new AbortController();

  set({
    _abortController: abortController,
  });

  try {
    let fullContent = '';

    for await (const chunk of streamChat(
      apiMessages,
      conversation.model,
    )) {
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
},
