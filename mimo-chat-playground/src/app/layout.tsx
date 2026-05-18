import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MiMo Chat Playground',
  description:
    'A full-featured AI chat playground for Xiaomi MiMo-V2.5 models with streaming, multi-modal support, and built-in agent tools.',
  keywords: ['MiMo', 'Xiaomi', 'AI Chat', 'LLM', 'Playground', 'Agent'],
  authors: [{ name: 'MiMo Chat Playground Contributors' }],
  openGraph: {
    title: 'MiMo Chat Playground',
    description: '基于 Xiaomi MiMo-V2.5 大模型的全功能 AI 聊天 Playground',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = JSON.parse(localStorage.getItem('mimo-chat-storage') || '{}')?.state?.theme;
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}
