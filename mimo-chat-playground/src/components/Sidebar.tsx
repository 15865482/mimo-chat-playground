'use client';

import { useChatStore } from '@/lib/store';
import { formatDate, cn } from '@/lib/utils';
import {
  MessageSquare,
  Plus,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Edit3,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    sidebarOpen,
    setActiveConversation,
    createNewConversation,
    deleteConversation,
    renameConversation,
    toggleSidebar,
  } = useChatStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed left-3 top-3 z-50 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
        title="展开侧边栏"
      >
        <PanelLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    );
  }

  const startRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const submitRename = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="w-72 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-mimo-500" />
            <h1 className="font-semibold text-gray-900 dark:text-white text-sm">MiMo Chat</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="收起侧边栏"
          >
            <PanelLeftClose className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <button
          onClick={() => createNewConversation()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-mimo-600 hover:bg-mimo-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建对话
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8 px-4">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            还没有对话，点击上方按钮开始
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer mb-0.5 transition-colors',
                activeConversationId === conv.id
                  ? 'bg-mimo-50 dark:bg-mimo-950 text-mimo-700 dark:text-mimo-300'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
              )}
              onClick={() => setActiveConversation(conv.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {editingId === conv.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => submitRename(conv.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitRename(conv.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-transparent border-b border-mimo-500 outline-none text-sm"
                    autoFocus
                  />
                ) : (
                  <p className="text-sm truncate">{conv.title}</p>
                )}
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startRename(conv.id, conv.title);
                  }}
                  className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  title="重命名"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
                  title="删除"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Powered by Xiaomi MiMo
        </p>
      </div>
    </aside>
  );
}
