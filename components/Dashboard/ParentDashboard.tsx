'use client';

import React from 'react';
import { GraduationCap, Calendar, FileText, MessageSquare, BarChart3, Clock } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const ParentDashboard = () => {
  // Mock data - replace with actual data from API
  const children = [
    {
      id: 1,
      name: 'Emma Johnson',
      class: 'Grade 9',
      section: 'A',
      rollNumber: '091',
      attendancePercentage: 92,
      averageMarks: 87,
    }
  ];

  const stats = {
    attendanceThisMonth: 92,
    pendingHomework: 3,
    unreadMessages: 2,
    averageGrade: 'A-',
  };

  const recentActivities = [
    { id: 1, type: 'homework', title: 'Math Assignment submitted', time: '2 hours ago', status: 'submitted' },
    { id: 2, type: 'marks', title: 'Physics Test Result: 85/100', time: '1 day ago', status: 'graded' },
    { id: 3, type: 'attendance', title: 'Present in all classes', time: '1 day ago', status: 'present' },
    { id: 4, type: 'message', title: 'New message from Math Teacher', time: '2 days ago', status: 'unread' },
  ];

  const upcomingHomework = [
    { id: 1, subject: 'English', title: 'Essay Writing', dueDate: 'Tomorrow', status: 'pending' },
    { id: 2, subject: 'Science', title: 'Lab Report', dueDate: 'Oct 25', status: 'in-progress' },
    { id: 3, subject: 'History', title: 'Research Project', dueDate: 'Oct 28', status: 'pending' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'homework':
        return <FileText className="h-4 w-4" />;
      case 'marks':
        return <BarChart3 className="h-4 w-4" />;
      case 'attendance':
        return <Calendar className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'present':
      case 'graded':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'unread':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Parent!</h2>
        <p className="text-purple-100">
          Stay updated with {children[0]?.name}  academic progress and school activities.
        </p>
      </div>

      {/* Child Info Card */}
      <Card className="border-l-4 border-l-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Student Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">{children[0]?.name}</h3>
              <p className="text-muted-foreground">
                {children[0]?.class} - Section {children[0]?.section}
              </p>
              <p className="text-sm text-muted-foreground">
                Roll No: {children[0]?.rollNumber}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Attendance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Month</span>
                  <span>{children[0]?.attendancePercentage}%</span>
                </div>
                <Progress value={children[0]?.attendancePercentage} className="h-2" />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Academic Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Marks</span>
                  <span>{children[0]?.averageMarks}%</span>
                </div>
                <Progress value={children[0]?.averageMarks} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceThisMonth}%`}
          icon={Calendar}
          color="green"
          change="2% from last month"
          changeType="positive"
        />
        <StatsCard
          title="Average Grade"
          value={stats.averageGrade}
          icon={BarChart3}
          color="blue"
        />
        <StatsCard
          title="Pending Homework"
          value={stats.pendingHomework}
          icon={FileText}
          color="orange"
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon={MessageSquare}
          color="purple"
        />
      </div>

      {/* Recent Activities & Upcoming Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activities</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full bg-gray-100 ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Homework */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Homework</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingHomework.map((homework) => (
                <div key={homework.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{homework.title}</p>
                      <p className="text-xs text-muted-foreground">{homework.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Due: {homework.dueDate}</p>
                    <Badge variant={homework.status === 'pending' ? 'destructive' : 'secondary'}>
                      {homework.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">View Marks</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Check Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Homework Status</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Messages</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};