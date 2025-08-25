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
import { Plus, Search, Edit, Eye, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Mark } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function MarksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const marks: Mark[] = [
    {
      id: 1,
      studentId: 1,
      subjectId: 1,
      classId: 1,
      examType: 'midterm',
      marksObtained: 85,
      totalMarks: 100,
      examDate: '2024-01-15',
      student: { id: 1, studentId: 'STU001', name: 'Alice Johnson', isActive: true },
      subject: { id: 1, name: 'Mathematics', code: 'MATH', isActive: true },
      class: { id: 1, name: 'Grade 9', isActive: true },
      createdBy:2
    },
    {
      id: 2,
      studentId: 1,
      subjectId: 2,
      classId: 1,
      examType: 'quiz',
      marksObtained: 18,
      totalMarks: 20,
      examDate: '2024-01-10',
      student: { id: 1, studentId: 'STU001', name: 'Alice Johnson', isActive: true },
      subject: { id: 2, name: 'Physics', code: 'PHY', isActive: true },
      class: { id: 1, name: 'Grade 9', isActive: true },
      createdBy:2
    },
    {
      id: 3,
      studentId: 2,
      subjectId: 1,
      classId: 1,
      examType: 'assignment',
      marksObtained: 28,
      totalMarks: 30,
      examDate: '2024-01-12',
      student: { id: 2, studentId: 'STU002', name: 'Bob Smith', isActive: true },
      subject: { id: 1, name: 'Mathematics', code: 'MATH', isActive: true },
      class: { id: 1, name: 'Grade 9', isActive: true },
      createdBy:2
    },
  ];

  const filteredMarks = marks.filter(mark => {
    const matchesSearch = mark.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mark.subject?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || mark.class?.name === selectedClass;
    const matchesSubject = selectedSubject === 'all' || mark.subject?.name === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const getPercentage = (obtained: number, total: number) => {
    return Math.round((obtained / total) * 100);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-600 bg-green-50';
      case 'A': return 'text-green-600 bg-green-50';
      case 'B': return 'text-blue-600 bg-blue-50';
      case 'C': return 'text-yellow-600 bg-yellow-50';
      case 'D': return 'text-orange-600 bg-orange-50';
      case 'F': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-green-100 text-green-800';
      case 'midterm': return 'bg-purple-100 text-purple-800';
      case 'final': return 'bg-red-100 text-red-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';

  return (
    <Layout title="Marks Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {isTeacher ? 'Marks Management' : isParent ? 'Student Marks' : 'Marks Overview'}
            </h2>
            <p className="text-muted-foreground">
              {isTeacher 
                ? 'Add and manage student marks and grades'
                : isParent 
                  ? 'View your child\'s academic performance'
                  : 'Monitor academic performance across all students'
              }
            </p>
          </div>
          {isTeacher && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Marks
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Marks</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <p className="text-muted-foreground">
                    Marks entry form would be implemented here with fields for student, subject, exam type, and marks.
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
              <CardTitle className="text-sm font-medium">Total Marks Entries</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marks.length}</div>
              <p className="text-xs text-muted-foreground">All assessments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(marks.reduce((acc, mark) => acc + getPercentage(mark.marksObtained, mark.totalMarks), 0) / marks.length)}%
              </div>
              <p className="text-xs text-green-600">Above average</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">A+ Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marks.filter(mark => getPercentage(mark.marksObtained, mark.totalMarks) >= 90).length}
              </div>
              <p className="text-xs text-muted-foreground">Excellent performance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Below Average</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marks.filter(mark => getPercentage(mark.marksObtained, mark.totalMarks) < 60).length}
              </div>
              <p className="text-xs text-red-600">Need attention</p>
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
                  placeholder="Search by student or subject..."
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
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Marks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Marks Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                    {isTeacher && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMarks.map((mark) => {
                    const percentage = getPercentage(mark.marksObtained, mark.totalMarks);
                    const grade = getGrade(percentage);
                    
                    return (
                      <TableRow key={mark.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{mark.student?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {mark.student?.studentId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{mark.subject?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {mark.subject?.code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{mark.class?.name}</TableCell>
                        <TableCell>
                          <Badge className={getExamTypeColor(mark.examType)}>
                            {mark.examType.charAt(0).toUpperCase() + mark.examType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {mark.marksObtained}/{mark.totalMarks}
                            </p>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{percentage}%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(grade)}>
                            {grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {mark.examDate && new Date(mark.examDate).toLocaleDateString()}
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
            
            {filteredMarks.length === 0 && (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No marks records found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}