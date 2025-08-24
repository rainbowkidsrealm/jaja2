// components/Layout/Layout.tsx
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import ClientLayout from './ClientLayout';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={true} onClose={() => {}} /> {/* Static default, controlled client-side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} onMenuClick={() => {}} /> {/* Static default */}
        <ClientLayout>{children}</ClientLayout>
      </div>
    </div>
  );
};