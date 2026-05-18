'use client';

import { useChatStore } from '@/lib/store';
import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import SystemPromptEditor from './SystemPromptEditor';
import ModelSelector from './ModelSelector';
import TokenCounter from './TokenCounter';
import ThemeToggle from './ThemeToggle';
import WelcomeScreen from './WelcomeScreen';

export default function ChatInterface() {
  const { activeConversationId, conversations } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === activeConversationId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!activeConversationId || !conversation) {
    return <WelcomeScreen />;
  }

  const visibleMessages = conversation.messages.filter((m) => m.role !== 'system');

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <ModelSelector />
          {conversation.messages.length > 0 && <TokenCounter />}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* System prompt editor */}
      <SystemPromptEditor />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {visibleMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
            发送第一条消息开始对话
          </div>
        ) : (
          visibleMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
