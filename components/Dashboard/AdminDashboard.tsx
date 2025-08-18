'use client';

import React from 'react';
import { Users, GraduationCap, BookOpen, School } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AdminDashboard = () => {
  // Mock data - replace with actual data from API
  const stats = {
    totalStudents: 1250,
    totalTeachers: 85,
    totalParents: 950,
    totalClasses: 24,
  };

  const recentActivities = [
    { id: 1, action: 'New teacher registered', user: 'John Smith', time: '2 hours ago' },
    { id: 2, action: 'Student admitted', user: 'Alice Johnson', time: '4 hours ago' },
    { id: 3, action: 'Parent account created', user: 'Bob Wilson', time: '6 hours ago' },
    { id: 4, action: 'New class created', user: 'Grade 9 - Section C', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
        <p className="text-blue-100">
          Here's what's happening in your school management system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          color="blue"
          change="12 this month"
          changeType="positive"
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          color="green"
          change="3 this month"
          changeType="positive"
        />
        <StatsCard
          title="Total Parents"
          value={stats.totalParents}
          icon={Users}
          color="purple"
          change="8 this month"
          changeType="positive"
        />
        <StatsCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={School}
          color="orange"
          change="2 this term"
          changeType="positive"
        />
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Add Teacher</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <GraduationCap className="h-6 w-6" />
                <span className="text-sm">Add Student</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <School className="h-6 w-6" />
                <span className="text-sm">Create Class</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm">Add Subject</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};