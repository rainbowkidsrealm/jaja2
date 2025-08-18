'use client';

import React from 'react';
import { GraduationCap, Calendar, FileText, MessageSquare, BarChart3, CheckSquare } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const TeacherDashboard = () => {
  // Mock data - replace with actual data from API
  const stats = {
    myStudents: 156,
    pendingHomework: 23,
    messagesUnread: 5,
    attendanceToday: 142,
  };

  const todayClasses = [
    { id: 1, class: 'Grade 9', section: 'A', subject: 'Mathematics', time: '09:00 AM', status: 'completed' },
    { id: 2, class: 'Grade 10', section: 'B', subject: 'Physics', time: '11:00 AM', status: 'ongoing' },
    { id: 3, class: 'Grade 9', section: 'C', subject: 'Mathematics', time: '02:00 PM', status: 'upcoming' },
  ];

  const pendingTasks = [
    { id: 1, task: 'Grade Physics assignments', class: 'Grade 10-A', dueDate: 'Today' },
    { id: 2, task: 'Upload Math test results', class: 'Grade 9-B', dueDate: 'Tomorrow' },
    { id: 3, task: 'Prepare homework for next week', class: 'Grade 9-A', dueDate: '2 days' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'ongoing':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Good morning, Teacher!</h2>
        <p className="text-green-100">
          You have 3 classes today and 23 assignments to review.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="My Students"
          value={stats.myStudents}
          icon={GraduationCap}
          color="blue"
        />
        <StatsCard
          title="Attendance Today"
          value={`${stats.attendanceToday}/${stats.myStudents}`}
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Pending Homework"
          value={stats.pendingHomework}
          icon={FileText}
          color="orange"
        />
        <StatsCard
          title="Unread Messages"
          value={stats.messagesUnread}
          icon={MessageSquare}
          color="purple"
        />
      </div>

      {/* Today's Schedule & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Classes</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(classItem.status)}`}></div>
                    <div>
                      <p className="font-medium">{classItem.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {classItem.class} - Section {classItem.section}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{classItem.time}</p>
                    <Badge variant={
                      classItem.status === 'completed' ? 'default' :
                      classItem.status === 'ongoing' ? 'destructive' : 'secondary'
                    }>
                      {classItem.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Tasks</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <CheckSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">{task.class}</p>
                    <p className="text-xs text-orange-600 mt-1">Due: {task.dueDate}</p>
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
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Take Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Add Marks</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Assign Homework</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Send Message</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};