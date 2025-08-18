'use client';

import { AdminDashboard } from '@/components/Dashboard/AdminDashboard';
import { ParentDashboard } from '@/components/Dashboard/ParentDashboard';
import { TeacherDashboard } from '@/components/Dashboard/TeacherDashboard';
import { Layout } from '@/components/Layout/Layout';
import { useAuth } from '@/contexts/AuthContext';


export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div></div>; // show spinner
  }

  if (!isAuthenticated || !user) {
    return <div></div>;
  }

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'teacher':
        return 'Teacher Dashboard';
      case 'parent':
        return 'Parent Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <div></div>;
    }
  };

  return (
    <Layout title={getDashboardTitle()}>
      {renderDashboard()}
    </Layout>
  );
}
