'use client';

import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) return null; // System prompts shown in editor

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-4 animate-fade-in',
        isUser ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-950',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isUser
            ? 'bg-mimo-100 dark:bg-mimo-900 text-mimo-600 dark:text-mimo-300'
            : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 max-w-3xl">
        {/* Role label */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {isUser ? 'You' : 'MiMo'}
          </span>
          {message.tokenCount && (
            <span className="text-xs text-gray-400">{message.tokenCount} tokens</span>
          )}
        </div>

        {/* Message content */}
        {isUser ? (
          <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.content ? (
              <ReactMarkdown
                components={{
                  pre: ({ children }) => <PreBlock>{children}</PreBlock>,
                  code: ({ children, className }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return isInline ? (
                      <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-xs font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>{children}</code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse-dot" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse-dot [animation-delay:0.2s]" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse-dot [animation-delay:0.4s]" />
              </div>
            )}
          </div>
        )}

        {/* Copy button (assistant only, non-empty) */}
        {!isUser && message.content && (
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" /> 已复制
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> 复制
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function PreBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = extractText(children);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 px-2 py-1 rounded text-xs bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
        {children}
      </pre>
    </div>
  );
}

function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText((children as { props: { children?: React.ReactNode } }).props.children);
  }
  return '';
}
