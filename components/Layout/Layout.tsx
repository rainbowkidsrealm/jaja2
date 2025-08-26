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
  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    } else {
      setSidebarOpen(window.innerWidth >= 768);
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen !== null) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

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
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - fixed */}
      <div className="fixed top-0 left-0 h-full z-20">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Right section */}
      <div className="flex-1 flex flex-col ml-64"> 
        {/* 👆 ml-64 = width of sidebar (adjust if sidebar width differs) */}

        {/* Header - fixed */}
        <div className="fixed top-0 left-64 right-0 z-10">
          <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        </div>

        {/* Scrollable content */}
        <main className="mt-16 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* 👆 4rem = height of header, adjust if different */}
          {children}
        </main>
      </div>
    </div>
  );
};
