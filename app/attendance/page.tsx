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
import { Calendar, Search, Edit, Eye, Plus, UserCheck, UserX, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Attendance } from '@/types';
import { AttendanceForm } from '@/components/Forms/AttendanceForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([
    {
      id: 1,
      studentId: 1,
      classId: 1,
      sectionId: 1,
      date: '2024-01-20',
      status: 'present',
      markedBy: 1,
      student: { id: 1, studentId: 'STU001', name: 'Alice Johnson', isActive: true },
      class: { id: 1, name: 'Grade 9', isActive: true },
      section: { id: 1, classId: 1, name: 'A', capacity: 30, isActive: true },
    },
    {
      id: 2,
      studentId: 2,
      classId: 1,
      sectionId: 2,
      date: '2024-01-20',
      status: 'absent',
      markedBy: 1,
      student: { id: 2, studentId: 'STU002', name: 'Bob Smith', isActive: true },
      class: { id: 1, name: 'Grade 9', isActive: true },
      section: { id: 2, classId: 1, name: 'B', capacity: 30, isActive: true },
    },
    {
      id: 3,
      studentId: 3,
      classId: 2,
      sectionId: 3,
      date: '2024-01-20',
      status: 'late',
      markedBy: 1,
      student: { id: 3, studentId: 'STU003', name: 'Carol Davis', isActive: true },
      class: { id: 2, name: 'Grade 10', isActive: true },
      section: { id: 3, classId: 2, name: 'A', capacity: 30, isActive: true },
    },
  ]);

  const filteredAttendance = attendanceRecords.filter(record => {
    const matchesSearch = record.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.student?.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    const matchesClass = selectedClass === 'all' || record.class?.name === selectedClass;
    return matchesSearch && matchesDate && matchesClass;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <UserCheck className="h-4 w-4" />;
      case 'absent':
        return <UserX className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceStats = () => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(r => r.status === 'present').length;
    const absent = filteredAttendance.filter(r => r.status === 'absent').length;
    const late = filteredAttendance.filter(r => r.status === 'late').length;
    const presentageRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, presentageRate };
  };

  const stats = getAttendanceStats();
  const handleAddAttendance = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (data: Attendance[]) => {
    // Add new attendance records
    setAttendanceRecords(prev => [...prev, ...data]);
    setIsDialogOpen(false);
    toast.success(`Attendance marked for ${data.length} students!`);
  };

  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';

  return (
    <Layout title="Attendance Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {isTeacher ? 'Attendance Management' : isParent ? 'Student Attendance' : 'Attendance Overview'}
            </h2>
            <p className="text-muted-foreground">
              {isTeacher 
                ? 'Mark and manage student attendance records'
                : isParent 
                  ? 'Track your child\'s attendance record'
                  : 'Monitor attendance across all students'
              }
            </p>
          </div>
          {isTeacher && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={handleAddAttendance}>
                  <Plus className="h-4 w-4" />
                  Mark Attendance
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>

        {/* Add Attendance Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mark Class Attendance</DialogTitle>
            </DialogHeader>
            <AttendanceForm
              onSubmit={handleFormSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">For selected date</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
              <p className="text-xs text-muted-foreground">{stats.presentageRate}% attendance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}% absent
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}% late
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Rate Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Attendance</span>
                <span className="text-sm text-muted-foreground">{stats.presentageRate}%</span>
              </div>
              <Progress value={stats.presentageRate} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{stats.present}</div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-600">{stats.late}</div>
                  <div className="text-xs text-muted-foreground">Late</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{stats.absent}</div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
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
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Attendance Records - {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Remarks</TableHead>
                    {isTeacher && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getStatusIcon(record.status)}
                          </div>
                          <div>
                            <p className="font-medium">{record.student?.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{record.student?.studentId}</p>
                      </TableCell>
                      <TableCell>{record.class?.name}</TableCell>
                      <TableCell>{record.section?.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {record.remarks || '-'}
                        </p>
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
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredAttendance.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No attendance records found for the selected date and criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}