'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null); // null until we know
  const { isAuthenticated, loading } = useAuth();

  // Load sidebar state only on client
  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    } else {
      setSidebarOpen(window.innerWidth >= 768); // default: open on desktop
    }
  }, []);

  // Save sidebar state when it changes
  useEffect(() => {
    if (sidebarOpen !== null) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  // Avoid rendering layout until sidebar state is known
  if (sidebarOpen === null || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main
          className="flex-1 overflow-auto p-4"
          onClick={sidebarOpen ? closeSidebar : undefined}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
