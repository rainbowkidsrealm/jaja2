'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Attendance } from '@/types';
import { toast } from 'sonner';
import { mockStudents, mockClasses } from '@/lib/mockData';
import { UserCheck, UserX, Clock } from 'lucide-react';

interface AttendanceFormProps {
  onSubmit: (data: Attendance[]) => void;
  onCancel: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedClass || !selectedSection) {
        toast.error('Please select class and section');
        return;
      }

      const filteredStudents = getFilteredStudents();
      
      if (filteredStudents.length === 0) {
        toast.error('No students found for selected class and section');
        return;
      }

      // Check if all students have attendance marked
      const unmarkedStudents = filteredStudents.filter(student => 
        !attendanceData[student.id.toString()]
      );

      if (unmarkedStudents.length > 0) {
        toast.error(`Please mark attendance for all students (${unmarkedStudents.length} remaining)`);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      const sectionId = parseInt(selectedSection.split('-')[0]); // Remove undefined fallback
      if (isNaN(sectionId)) {
        throw new Error('Invalid section ID');
      }
      
      const attendanceRecords: Attendance[] = filteredStudents.map(student => ({
        id: Date.now() + student.id, // Generate unique ID
        studentId: student.id,
        classId: parseInt(selectedClass),
        sectionId, // Use parsed section ID
        date: selectedDate,
        status: attendanceData[student.id.toString()] as 'present' | 'absent' | 'late',
        remarks: remarks[student.id.toString()] || undefined,
        markedBy: 1, // Current teacher ID
        student,
        class: mockClasses.find(c => c.id.toString() === selectedClass),
        section: undefined, // sections is a string, so no Section object
      }));

      onSubmit(attendanceRecords);
      toast.success('Attendance marked successfully!');
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStudents = () => {
    return mockStudents.filter(student => 
      student.classId?.toString() === selectedClass &&
      student.sectionId?.toString() === selectedSection.split('-')[0] // Match section ID
    );
  };

  const selectedClassData = mockClasses.find(c => c.id.toString() === selectedClass);
  const filteredStudents = getFilteredStudents();

  const getSectionOptions = () => {
    return selectedClassData?.sections
      ? selectedClassData.sections.split(',').map((name, index) => ({
          id: index + 1, // Generate a simple ID based on index
          name: name.trim(),
        }))
      : [];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <UserX className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAttendanceStats = () => {
    const total = filteredStudents.length;
    const marked = Object.keys(attendanceData).length;
    const present = Object.values(attendanceData).filter(status => status === 'present').length;
    const absent = Object.values(attendanceData).filter(status => status === 'absent').length;
    const late = Object.values(attendanceData).filter(status => status === 'late').length;
    
    return { total, marked, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Class Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select value={selectedClass} onValueChange={(value) => {
            setSelectedClass(value);
            setSelectedSection('');
            setAttendanceData({});
            setRemarks({});
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {mockClasses.map(cls => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="section">Section *</Label>
          <Select 
            value={selectedSection} 
            onValueChange={(value) => {
              setSelectedSection(value);
              setAttendanceData({});
              setRemarks({});
            }}
            disabled={!selectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {getSectionOptions().map(section => (
                <SelectItem key={section.id} value={`${section.id}-${section.name}`}>
                  Section {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Attendance Stats */}
      {filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.marked}</div>
                <div className="text-sm text-muted-foreground">Marked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <div className="text-sm text-muted-foreground">Late</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student List */}
      {filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance - {selectedClassData?.name} Section {selectedSection.split('-')[1]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.studentId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status Selection */}
                    <div className="flex space-x-2">
                      {['present', 'absent', 'late'].map((status) => (
                        <Button
                          key={status}
                          type="button"
                          variant={attendanceData[student.id.toString()] === status ? 'default' : 'outline'}
                          size="sm"
                          className={`${
                            attendanceData[student.id.toString()] === status 
                              ? getStatusColor(status) 
                              : ''
                          }`}
                          onClick={() => setAttendanceData(prev => ({
                            ...prev,
                            [student.id.toString()]: status
                          }))}
                        >
                          {getStatusIcon(status)}
                          <span className="ml-1 capitalize">{status}</span>
                        </Button>
                      ))}
                    </div>

                    {/* Current Status Badge */}
                    {attendanceData[student.id.toString()] && (
                      <Badge className={getStatusColor(attendanceData[student.id.toString()])}>
                        {attendanceData[student.id.toString()]}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Students Message */}
      {selectedClass && selectedSection && filteredStudents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No students found for the selected class and section.</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading || filteredStudents.length === 0 || stats.marked !== stats.total}
        >
          {loading ? 'Saving...' : 'Mark Attendance'}
        </Button>
      </div>
    </form>
  );
};