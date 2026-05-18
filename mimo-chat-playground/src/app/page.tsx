'use client';

import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <ChatInterface />
    </main>
  );
}
