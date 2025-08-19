'use client';

import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ always start open
  const [hydrated, setHydrated] = useState(false);
  const { isAuthenticated } = useAuth();

  // only run on client
  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setSidebarOpen(saved === 'true');
    }
    setHydrated(true);
  }, []);

  // sync changes back to storage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('sidebarOpen', String(sidebarOpen));
    }
  }, [sidebarOpen, hydrated]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // ⏳ Prevent SSR flicker: render nothing until client hydration is ready
  if (!hydrated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          title={title}
        />

        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
