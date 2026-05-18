'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { Settings2, ChevronDown, ChevronRight } from 'lucide-react';

export default function SystemPromptEditor() {
  const { activeConversationId, conversations, updateSystemPrompt } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localPrompt, setLocalPrompt] = useState('');

  const conversation = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    if (conversation) {
      setLocalPrompt(conversation.systemPrompt);
    }
  }, [conversation?.id]);

  if (!conversation) return null;

  const handleSave = () => {
    updateSystemPrompt(conversation.id, localPrompt);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <Settings2 className="w-3 h-3" />
        <span>System Prompt</span>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 ml-auto" />
        ) : (
          <ChevronRight className="w-3 h-3 ml-auto" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-3">
          <textarea
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
            onBlur={handleSave}
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 font-mono focus:outline-none focus:ring-2 focus:ring-mimo-500 focus:border-transparent resize-y"
            placeholder="设置系统提示词来定义 AI 的行为..."
          />
          <p className="text-xs text-gray-400 mt-1">
            离开焦点自动保存。定义 MiMo 的角色、语气和行为方式。
          </p>
        </div>
      )}
    </div>
  );
}
