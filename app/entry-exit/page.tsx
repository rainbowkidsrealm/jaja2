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
import { Clock, Search, LogIn, LogOut, Plus, Eye, Users, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { EntryExitForm } from '@/components/Forms/EntryExitForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EntryExitRecord {
  id: number;
  studentId: number;
  studentName: string;
  studentIdNumber: string;
  class: string;
  section: string;
  entryTime?: string;
  exitTime?: string;
  date: string;
  status: 'entered' | 'exited' | 'absent';
  lateEntry?: boolean;
  earlyExit?: boolean;
}

export default function EntryExitPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const [entryExitRecords, setEntryExitRecords] = useState<EntryExitRecord[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'Alice Johnson',
      studentIdNumber: 'STU001',
      class: 'Grade 9',
      section: 'A',
      entryTime: '08:15:00',
      exitTime: '15:30:00',
      date: '2024-01-20',
      status: 'exited',
      lateEntry: false,
      earlyExit: false,
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Bob Smith',
      studentIdNumber: 'STU002',
      class: 'Grade 9',
      section: 'B',
      entryTime: '08:45:00',
      date: '2024-01-20',
      status: 'entered',
      lateEntry: true,
      earlyExit: false,
    },
    {
      id: 3,
      studentId: 3,
      studentName: 'Carol Davis',
      studentIdNumber: 'STU003',
      class: 'Grade 10',
      section: 'A',
      date: '2024-01-20',
      status: 'absent',
      lateEntry: false,
      earlyExit: false,
    },
  ]);

  const filteredRecords = entryExitRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    const matchesClass = selectedClass === 'all' || record.class === selectedClass;
    return matchesSearch && matchesDate && matchesClass;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entered':
        return <LogIn className="h-4 w-4" />;
      case 'exited':
        return <LogOut className="h-4 w-4" />;
      case 'absent':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entered':
        return 'bg-blue-100 text-blue-800';
      case 'exited':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntryExitStats = () => {
    const total = filteredRecords.length;
    const entered = filteredRecords.filter(r => r.status === 'entered').length;
    const exited = filteredRecords.filter(r => r.status === 'exited').length;
    const absent = filteredRecords.filter(r => r.status === 'absent').length;
    const lateEntries = filteredRecords.filter(r => r.lateEntry).length;
    const earlyExits = filteredRecords.filter(r => r.earlyExit).length;
    const presentRate = total > 0 ? Math.round(((entered + exited) / total) * 100) : 0;

    return { total, entered, exited, absent, lateEntries, earlyExits, presentRate };
  };

  const stats = getEntryExitStats();

  const handleAddEntryExit = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // Add new entry/exit record
    const newRecord: EntryExitRecord = {
      id: Math.max(...entryExitRecords.map(r => r.id)) + 1,
      ...data,
    };
    setEntryExitRecords(prev => [...prev, newRecord]);
    setIsDialogOpen(false);
    toast.success('Entry/Exit record updated successfully!');
  };

  const formatTime = (time?: string) => {
    if (!time) return '-';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateDuration = (entryTime?: string, exitTime?: string) => {
    if (!entryTime || !exitTime) return '-';
    
    const entry = new Date(`2000-01-01T${entryTime}`);
    const exit = new Date(`2000-01-01T${exitTime}`);
    const diffMs = exit.getTime() - entry.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <Layout title="Entry/Exit Tracking">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Entry/Exit Tracking</h2>
            <p className="text-muted-foreground">
              Track student entry and exit times throughout the day
            </p>
          </div>
          {isTeacher && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={handleAddEntryExit}>
                  <Plus className="h-4 w-4" />
                  Mark Entry/Exit
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>

        {/* Add Entry/Exit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mark Student Entry/Exit</DialogTitle>
            </DialogHeader>
            <EntryExitForm
              onSubmit={handleFormSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Tracked today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently In</CardTitle>
              <LogIn className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.entered}</div>
              <p className="text-xs text-muted-foreground">In school</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exited</CardTitle>
              <LogOut className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.exited}</div>
              <p className="text-xs text-muted-foreground">Left school</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
              <p className="text-xs text-muted-foreground">Not present</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Entries</CardTitle>
              <Timer className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lateEntries}</div>
              <p className="text-xs text-muted-foreground">After 8:30 AM</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Early Exits</CardTitle>
              <Timer className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.earlyExits}</div>
              <p className="text-xs text-muted-foreground">Before 3:00 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Rate Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Presence Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Students Present</span>
                <span className="text-sm text-muted-foreground">{stats.presentRate}%</span>
              </div>
              <Progress value={stats.presentRate} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{stats.entered}</div>
                  <div className="text-xs text-muted-foreground">Currently In</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{stats.exited}</div>
                  <div className="text-xs text-muted-foreground">Completed Day</div>
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

        {/* Entry/Exit Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Entry/Exit Records - {new Date(selectedDate).toLocaleDateString()}
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
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    {isTeacher && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getStatusIcon(record.status)}
                          </div>
                          <div>
                            <p className="font-medium">{record.studentName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{record.studentIdNumber}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{record.class}</p>
                          <p className="text-sm text-muted-foreground">Section {record.section}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className={record.lateEntry ? 'text-orange-600 font-medium' : ''}>
                          {formatTime(record.entryTime)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className={record.earlyExit ? 'text-purple-600 font-medium' : ''}>
                          {formatTime(record.exitTime)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {calculateDuration(record.entryTime, record.exitTime)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {record.lateEntry && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Late
                            </Badge>
                          )}
                          {record.earlyExit && (
                            <Badge variant="outline" className="text-purple-600 border-purple-200">
                              Early
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      {isTeacher && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No entry/exit records found for the selected date and criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}