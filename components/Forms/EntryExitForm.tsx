'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';
import { mockStudents, mockClasses } from '@/lib/mockData';

interface EntryExitFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const EntryExitForm: React.FC<EntryExitFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entryExitData, setEntryExitData] = useState<Record<string, any>>({});
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

      // Check if any students have been marked
      const markedStudents = Object.keys(entryExitData).filter(studentId => 
        entryExitData[studentId].action
      );

      if (markedStudents.length === 0) {
        toast.error('Please mark entry/exit for at least one student');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process each marked student
      markedStudents.forEach(studentId => {
        const student = filteredStudents.find(s => s.id.toString() === studentId);
        const data = entryExitData[studentId];
        
        if (student && data.action) {
          onSubmit({
            studentId: student.id,
            studentName: student.name,
            studentIdNumber: student.studentId,
            class: selectedClass,
            section: selectedSection,
            date: selectedDate,
            entryTime: data.action === 'entry' ? data.time : undefined,
            exitTime: data.action === 'exit' ? data.time : undefined,
            status: data.action === 'entry' ? 'entered' : 'exited',
            lateEntry: data.action === 'entry' && isLateEntry(data.time),
            earlyExit: data.action === 'exit' && isEarlyExit(data.time),
          });
        }
      });

      toast.success(`Entry/Exit marked for ${markedStudents.length} students!`);
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStudents = () => {
    let students = mockStudents.filter(student => 
      student.classId?.toString() === selectedClass &&
      student.sectionId?.toString() === selectedSection
    );

    if (searchTerm) {
      students = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return students;
  };

  const isLateEntry = (time: string) => {
    const entryTime = new Date(`2000-01-01T${time}`);
    const lateThreshold = new Date('2000-01-01T08:30:00');
    return entryTime > lateThreshold;
  };

  const isEarlyExit = (time: string) => {
    const exitTime = new Date(`2000-01-01T${time}`);
    const earlyThreshold = new Date('2000-01-01T15:00:00');
    return exitTime < earlyThreshold;
  };

  const handleStudentAction = (studentId: string, action: 'entry' | 'exit', time: string) => {
    setEntryExitData(prev => ({
      ...prev,
      [studentId]: { action, time }
    }));
  };

  const selectedClassData = mockClasses.find(c => c.id.toString() === selectedClass);
  const filteredStudents = getFilteredStudents();

  // Parse sections if it's a string, otherwise use as array
  const getSectionOptions = () => {
    if (!selectedClassData) return [];
    if (typeof selectedClassData.sections === 'string') {
      return selectedClassData.sections.split(',').map((name, index) => ({
        id: index + 1,
        name: name.trim(),
      }));
    }
    return selectedClassData.sections || [];
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'entry':
        return <LogIn className="h-4 w-4 text-blue-600" />;
      case 'exit':
        return <LogOut className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'entry':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exit':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMarkedCount = () => {
    return Object.keys(entryExitData).filter(studentId => 
      entryExitData[studentId].action
    ).length;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Class Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select value={selectedClass} onValueChange={(value) => {
            setSelectedClass(value);
            setSelectedSection('');
            setEntryExitData({});
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
              setEntryExitData({});
            }}
            disabled={!selectedClass}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {getSectionOptions().map(section => (
                <SelectItem key={section.id} value={section.id.toString()}>
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

      {/* Search */}
      {filteredStudents.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Summary Stats */}
      {filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entry/Exit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{filteredStudents.length}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{getMarkedCount()}</div>
                <div className="text-sm text-muted-foreground">Marked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(entryExitData).filter(d => d.action === 'entry').length}
                </div>
                <div className="text-sm text-muted-foreground">Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Object.values(entryExitData).filter(d => d.action === 'exit').length}
                </div>
                <div className="text-sm text-muted-foreground">Exits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student List */}
      {filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Mark Entry/Exit - {selectedClassData?.name} Section {getSectionOptions().find(s => s.id.toString() === selectedSection)?.name}
            </CardTitle>
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
                    {/* Action Selection */}
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={entryExitData[student.id.toString()]?.action === 'entry' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const currentTime = new Date().toTimeString().slice(0, 5);
                          handleStudentAction(student.id.toString(), 'entry', currentTime);
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-1" />
                        Entry
                      </Button>
                      <Button
                        type="button"
                        variant={entryExitData[student.id.toString()]?.action === 'exit' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const currentTime = new Date().toTimeString().slice(0, 5);
                          handleStudentAction(student.id.toString(), 'exit', currentTime);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Exit
                      </Button>
                    </div>

                    {/* Time Input */}
                    {entryExitData[student.id.toString()]?.action && (
                      <Input
                        type="time"
                        value={entryExitData[student.id.toString()]?.time || ''}
                        onChange={(e) => {
                          const action = entryExitData[student.id.toString()]?.action;
                          handleStudentAction(student.id.toString(), action, e.target.value);
                        }}
                        className="w-32"
                      />
                    )}

                    {/* Current Status Badge */}
                    {entryExitData[student.id.toString()]?.action && (
                      <div className="flex items-center gap-2">
                        <Badge className={getActionColor(entryExitData[student.id.toString()]?.action)}>
                          {getActionIcon(entryExitData[student.id.toString()]?.action)}
                          <span className="ml-1">
                            {entryExitData[student.id.toString()]?.action === 'entry' ? 'Entry' : 'Exit'}
                          </span>
                        </Badge>
                        {entryExitData[student.id.toString()]?.action === 'entry' && 
                         isLateEntry(entryExitData[student.id.toString()]?.time) && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Late
                          </Badge>
                        )}
                        {entryExitData[student.id.toString()]?.action === 'exit' && 
                         isEarlyExit(entryExitData[student.id.toString()]?.time) && (
                          <Badge variant="outline" className="text-purple-600 border-purple-200">
                            Early
                          </Badge>
                        )}
                      </div>
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
          disabled={loading || filteredStudents.length === 0 || getMarkedCount() === 0}
        >
          {loading ? 'Saving...' : `Save Entry/Exit (${getMarkedCount()})`}
        </Button>
      </div>
    </form>
  );
};