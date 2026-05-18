'use client';

import { useChatStore } from '@/lib/store';
import { MessageSquare, Zap, ArrowRight } from 'lucide-react';

export default function WelcomeScreen() {
  const { createNewConversation } = useChatStore();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mimo-400 to-mimo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-mimo-500/25">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          MiMo Chat Playground
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          基于 Xiaomi MiMo-V2.5 系列大模型的全功能聊天体验。
          支持百万上下文、多模态输入、流式响应，适配 Coding Agent 和通用对话场景。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                const id = createNewConversation();
                // Navigate to the new conversation
              }}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-left hover:border-mimo-400 hover:bg-mimo-50/50 dark:hover:bg-mimo-950/20 transition-all group"
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-mimo-700 dark:group-hover:text-mimo-300">
                  {s.label}
                </p>
                <p className="text-xs text-gray-400">{s.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-mimo-500 ml-auto flex-shrink-0" />
            </button>
          ))}
        </div>

        <button
          onClick={() => createNewConversation()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mimo-600 hover:bg-mimo-700 text-white font-medium transition-colors shadow-lg shadow-mimo-500/25"
        >
          <MessageSquare className="w-4 h-4" />
          开始新对话
        </button>
      </div>
    </div>
  );
}

const suggestions = [
  { icon: '💻', label: '代码助手', desc: '帮我写个 React 组件' },
  { icon: '📝', label: '内容创作', desc: '写一篇技术博客文章' },
  { icon: '🔍', label: '数据分析', desc: '分析一段数据并生成报告' },
  { icon: '🌐', label: '翻译助手', desc: '中英文翻译和润色' },
];
