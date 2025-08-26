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
import { Mark } from '@/types';
import { toast } from 'sonner';
import { mockStudents, mockSubjects, mockClasses } from '@/lib/mockData';

interface MarkFormProps {
  mark?: Mark;
  onSubmit: (data: Partial<Mark>) => void;
  onCancel: () => void;
}

export const MarkForm: React.FC<MarkFormProps> = ({
  mark,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    studentId: mark?.studentId?.toString() || '',
    subjectId: mark?.subjectId?.toString() || '',
    classId: mark?.classId?.toString() || '',
    examType: mark?.examType || '',
    marksObtained: mark?.marksObtained?.toString() || '',
    totalMarks: mark?.totalMarks?.toString() || '',
    examDate: mark?.examDate || '',
    remarks: mark?.remarks || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.studentId || !formData.subjectId || !formData.examType || 
          !formData.marksObtained || !formData.totalMarks) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate marks
      const obtained = parseFloat(formData.marksObtained);
      const total = parseFloat(formData.totalMarks);
      
      if (obtained > total) {
        toast.error('Marks obtained cannot be greater than total marks');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit({
        ...formData,
        studentId: parseInt(formData.studentId),
        subjectId: parseInt(formData.subjectId),
        classId: parseInt(formData.classId),
        marksObtained: obtained,
        totalMarks: total,
        createdBy: 1, // Current teacher ID
        examType: formData.examType as 'quiz' | 'assignment' | 'midterm' | 'final' | 'project',
        examDate: formData.examDate,
        remarks: formData.remarks,
      });
      
      
      toast.success(mark ? 'Marks updated successfully!' : 'Marks added successfully!');
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedClass = mockClasses.find(c => c.id.toString() === formData.classId);
  const filteredStudents = mockStudents.filter(s => 
    !formData.classId || s.classId?.toString() === formData.classId
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select value={formData.classId} onValueChange={(value) => {
            handleChange('classId', value);
            handleChange('studentId', ''); // Reset student when class changes
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
          <Label htmlFor="student">Student *</Label>
          <Select 
            value={formData.studentId} 
            onValueChange={(value) => handleChange('studentId', value)}
            disabled={!formData.classId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {filteredStudents.map(student => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name} ({student.studentId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Select value={formData.subjectId} onValueChange={(value) => handleChange('subjectId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {mockSubjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name} ({subject.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="examType">Exam Type *</Label>
          <Select value={formData.examType} onValueChange={(value) => handleChange('examType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select exam type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="midterm">Midterm</SelectItem>
              <SelectItem value="final">Final</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marksObtained">Marks Obtained *</Label>
          <Input
            id="marksObtained"
            type="number"
            min="0"
            step="0.5"
            value={formData.marksObtained}
            onChange={(e) => handleChange('marksObtained', e.target.value)}
            placeholder="Enter marks obtained"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalMarks">Total Marks *</Label>
          <Input
            id="totalMarks"
            type="number"
            min="1"
            step="0.5"
            value={formData.totalMarks}
            onChange={(e) => handleChange('totalMarks', e.target.value)}
            placeholder="Enter total marks"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="examDate">Exam Date</Label>
          <Input
            id="examDate"
            type="date"
            value={formData.examDate}
            onChange={(e) => handleChange('examDate', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          value={formData.remarks}
          onChange={(e) => handleChange('remarks', e.target.value)}
          placeholder="Enter any remarks or comments"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : mark ? 'Update Marks' : 'Add Marks'}
        </Button>
      </div>
    </form>
  );
};