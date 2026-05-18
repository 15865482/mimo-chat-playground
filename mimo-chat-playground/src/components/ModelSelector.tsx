'use client';

import { useChatStore } from '@/lib/store';
import { MODELS, type ModelId } from '@/types';
import { ChevronDown, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ModelSelector() {
  const { activeConversationId, conversations, setModel } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === activeConversationId);
  const currentModel = conversation?.model || 'mimo-v2.5-pro';
  const modelInfo = MODELS[currentModel];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (modelId: ModelId) => {
    if (conversation) {
      setModel(conversation.id, modelId);
    }
    setIsOpen(false);
  };

  if (!conversation) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 hover:border-mimo-400 transition-colors"
      >
        <Cpu className="w-3.5 h-3.5 text-mimo-500" />
        <span>{modelInfo.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-72 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden">
          {(Object.entries(MODELS) as [ModelId, typeof modelInfo][]).map(([id, info]) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                currentModel === id ? 'bg-mimo-50 dark:bg-mimo-950' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <Cpu className={`w-3.5 h-3.5 ${currentModel === id ? 'text-mimo-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${currentModel === id ? 'text-mimo-700 dark:text-mimo-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {info.name}
                </span>
                {currentModel === id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-mimo-500" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 ml-5.5">{info.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
