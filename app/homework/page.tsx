'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Search, Edit, Eye, FileText, Calendar, CheckSquare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Homework } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeworkPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const homeworkAssignments: Homework[] = [
    {
      id: 1,
      title: 'Algebra Practice Problems',
      description: 'Complete exercises 1-20 from chapter 5',
      classId: 1,
      sectionId: 1,
      subjectId: 1,
      assignedDate: '2024-01-15',
      dueDate: '2024-01-22',
      assignedBy: 1,
      isActive: true,
      class: { id: 1, name: 'Grade 9', isActive: true },
      section: { id: 1, classId: 1, name: 'A', capacity: 30, isActive: true },
      subject: { id: 1, name: 'Mathematics', code: 'MATH', isActive: true },
      teacher: {
        id: 1,
        teacher_id: 'T001',
        name: 'Jane Smith',
        experience_years: 5,
        // isActive: true,
        user: {
          id: 1, email: 'jane.smith@example.com', name: 'Jane Smith', role: 'teacher', isActive: true,
          createdAt: '',
          updatedAt: '',
          mustChangePassword: false
        },
        email: ''
      },
      submissions: [
        { id: 1, homeworkId: 1, studentId: 1, status: 'submitted', submittedAt: '2024-01-20T10:00:00Z' },
        { id: 2, homeworkId: 1, studentId: 2, status: 'pending' },
      ],
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      description: 'Write a detailed report on the pendulum experiment',
      classId: 1,
      sectionId: 2,
      subjectId: 2,
      assignedDate: '2024-01-18',
      dueDate: '2024-01-25',
      assignedBy: 2,
      isActive: true,
      class: { id: 1, name: 'Grade 9', isActive: true },
      section: { id: 2, classId: 1, name: 'B', capacity: 30, isActive: true },
      subject: { id: 2, name: 'Physics', code: 'PHY', isActive: true },
      teacher: {
        id: 2,
        teacher_id: 'T002',
        name: 'John Doe',
        experience_years: 8,
        // isActive: true,
        user: {
          id: 2, email: 'john.doe@example.com', name: 'John Doe', role: 'teacher', isActive: true,
          createdAt: '',
          updatedAt: '',
          mustChangePassword: false
        },
        email: ''
      },
      submissions: [
        { id: 3, homeworkId: 2, studentId: 1, status: 'pending' }, // Changed from 'in-progress' to 'pending'
      ],
    },
    {
      id: 3,
      title: 'Essay on Climate Change',
      description: 'Write a 500-word essay on the impacts of climate change',
      classId: 2,
      sectionId: 3,
      subjectId: 5,
      assignedDate: '2024-01-20',
      dueDate: '2024-01-28',
      assignedBy: 3,
      isActive: true,
      class: { id: 2, name: 'Grade 10', isActive: true },
      section: { id: 3, classId: 2, name: 'A', capacity: 30, isActive: true },
      subject: { id: 5, name: 'English', code: 'ENG', isActive: true },
      teacher: {
        id: 3,
        teacher_id: 'T003',
        name: 'Sarah Wilson',
        experience_years: 3,
        // isActive: true,
        user: {
          id: 3, email: 'sarah.wilson@example.com', name: 'Sarah Wilson', role: 'teacher', isActive: true,
          createdAt: '',
          updatedAt: '',
          mustChangePassword: false
        },
        email: ''
      },
      submissions: [],
    },
  ];

  const filteredHomework = homeworkAssignments.filter(homework => {
    const matchesSearch = homework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homework.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || homework.class?.name === selectedClass;
    const matchesSubject = selectedSubject === 'all' || homework.subject?.name === selectedSubject;
    
    let matchesStatus = true;
    if (selectedStatus !== 'all') {
      const now = new Date();
      const dueDate = new Date(homework.dueDate);
      const isOverdue = dueDate < now;
      const submissionRate = homework.submissions ? 
        (homework.submissions.filter(s => s.status === 'submitted').length / homework.submissions.length) * 100 : 0;
      
      switch (selectedStatus) {
        case 'pending':
          matchesStatus = !isOverdue && submissionRate < 100;
          break;
        case 'overdue':
          matchesStatus = isOverdue;
          break;
        case 'completed':
          matchesStatus = submissionRate === 100;
          break;
      }
    }
    
    return matchesSearch && matchesClass && matchesSubject && matchesStatus;
  });

  const getHomeworkStatus = (homework: Homework) => {
    const now = new Date();
    const dueDate = new Date(homework.dueDate);
    const isOverdue = dueDate < now;
    const totalSubmissions = homework.submissions?.length || 0;
    const completedSubmissions = homework.submissions?.filter(s => s.status === 'submitted').length || 0;
    const submissionRate = totalSubmissions > 0 ? (completedSubmissions / totalSubmissions) * 100 : 0;

    if (isOverdue) return { status: 'overdue', color: 'bg-red-100 text-red-800' };
    if (submissionRate === 100) return { status: 'completed', color: 'bg-green-100 text-green-800' };
    return { status: 'pending', color: 'bg-yellow-100 text-yellow-800' };
  };

  const getSubmissionStats = (homework: Homework) => {
    const total = homework.submissions?.length || 0;
    const submitted = homework.submissions?.filter(s => s.status === 'submitted').length || 0;
    const pending = homework.submissions?.filter(s => s.status === 'pending').length || 0;
    const inProgress = 0; // Removed invalid 'in-progress' filter
    const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

    return { total, submitted, pending, inProgress, rate };
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';

  // Overall stats
  const totalHomework = homeworkAssignments.length;
  const overdueHomework = homeworkAssignments.filter(h => new Date(h.dueDate) < new Date()).length;
  const completedHomework = homeworkAssignments.filter(h => {
    const stats = getSubmissionStats(h);
    return stats.rate === 100;
  }).length;
  const avgSubmissionRate = homeworkAssignments.reduce((acc, h) => {
    const stats = getSubmissionStats(h);
    return acc + stats.rate;
  }, 0) / homeworkAssignments.length;

  return (
    <Layout title="Homework Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {isTeacher ? 'Homework Management' : isParent ? 'Student Homework' : 'Homework Overview'}
            </h2>
            <p className="text-muted-foreground">
              {isTeacher 
                ? 'Create and track homework assignments'
                : isParent 
                  ? 'Track your child\'s homework progress'
                  : 'Monitor homework assignments and submissions'
              }
            </p>
          </div>
          {isTeacher && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Assign Homework
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Homework Assignment</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <p className="text-muted-foreground">
                    Homework creation form would be implemented here with fields for title, description, class, subject, and due date.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHomework}</div>
              <p className="text-xs text-muted-foreground">All homework</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedHomework}</div>
              <p className="text-xs text-muted-foreground">100% submission rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueHomework}</div>
              <p className="text-xs text-muted-foreground">Past due date</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Submission Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(avgSubmissionRate)}%</div>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search homework assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Classes</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
                <option value="Chemistry">Chemistry</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Homework Table */}
        <Card>
          <CardHeader>
            <CardTitle>Homework Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Class & Subject</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    {isTeacher && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHomework.map((homework) => {
                    const { status, color } = getHomeworkStatus(homework);
                    const stats = getSubmissionStats(homework);
                    const daysUntilDue = getDaysUntilDue(homework.dueDate);
                    
                    return (
                      <TableRow key={homework.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{homework.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {homework.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              By: {homework.teacher?.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {homework.class?.name} - {homework.section?.name}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {homework.subject?.name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date(homework.assignedDate).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {new Date(homework.dueDate).toLocaleDateString()}
                            </p>
                            <p className={`text-xs ${
                              daysUntilDue < 0 ? 'text-red-600' : 
                              daysUntilDue <= 2 ? 'text-orange-600' : 'text-muted-foreground'
                            }`}>
                              {daysUntilDue < 0 
                                ? `${Math.abs(daysUntilDue)} days overdue`
                                : daysUntilDue === 0 
                                  ? 'Due today'
                                  : `${daysUntilDue} days left`
                              }
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={color}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{stats.submitted}/{stats.total}</span>
                              <span>{stats.rate}%</span>
                            </div>
                            <Progress value={stats.rate} className="h-2" />
                            <div className="flex gap-2 text-xs">
                              <span className="text-green-600">✓ {stats.submitted}</span>
                              <span className="text-blue-600">◐ {stats.inProgress}</span> {/* Note: inProgress is 0 */}
                              <span className="text-gray-600">○ {stats.pending}</span>
                            </div>
                          </div>
                        </TableCell>
                        {isTeacher && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {filteredHomework.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No homework assignments found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}