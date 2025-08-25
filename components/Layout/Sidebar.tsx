'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  Settings,
  UserCog,
  School,
  FileText,
  BarChart3,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roles: Array<'admin' | 'teacher' | 'parent'>;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['admin', 'teacher', 'parent'],
  },
  {
    href: '/students',
    icon: GraduationCap,
    label: 'Students',
    roles: ['admin', 'teacher'],
  },
  {
    href: '/teachers',
    icon: Users,
    label: 'Teachers',
    roles: ['admin'],
  },
  {
    href: '/parents',
    icon: UserCog,
    label: 'Parents',
    roles: ['admin'],
  },
  {
    href: '/classes',
    icon: School,
    label: 'Classes',
    roles: ['admin', 'teacher'],
  },
  {
    href: '/subjects',
    icon: BookOpen,
    label: 'Subjects',
    roles: ['admin', 'teacher'],
  },
  {
    href: '/marks',
    icon: BarChart3,
    label: 'Marks',
    roles: ['teacher', 'parent'],
  },
  {
    href: '/attendance',
    icon: Calendar,
    label: 'Attendance',
    roles: ['teacher', 'parent'],
  },
  {
    href: '/homework',
    icon: FileText,
    label: 'Homework',
    roles: ['teacher', 'parent'],
  },
  {
    href: '/messages',
    icon: MessageSquare,
    label: 'Messages',
    roles: ['teacher', 'parent'],
  },
  {
    href: '/reports',
    icon: ClipboardCheck,
    label: 'Reports',
    roles: ['admin', 'teacher'],
  },
  {
    href: '/settings',
    icon: Settings,
    label: 'Settings',
    roles: ['admin', 'teacher', 'parent'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const filteredNavItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose(); // Close sidebar after navigation
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'border-blue-600';
      case 'teacher':
        return 'border-green-600';
      case 'parent':
        return 'border-purple-600';
      default:
        return 'border-gray-600';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          getRoleColor()
        )}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-2">
            <School className="h-8 w-8 text-primary" />
            <div>
              <h2 className="font-bold text-lg">SchoolMS</h2>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 bg-white h-full overflow-y-auto">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};