
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Teacher } from '@/types';
import { toast } from 'sonner';

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: Partial<Teacher>) => void;
  onCancel: () => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  teacher,
  onSubmit,
  onCancel,
}) => {
const [formData, setFormData] = useState({
  teacher_id: teacher?.teacher_id || '',
  name: teacher?.name || '',
  email: teacher?.email || '',
  phone: teacher?.phone || '',
  address: teacher?.address || '',
  qualification: teacher?.qualification || '',
  experienceYears: teacher?.experience_years?.toString() || '',
});




  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({
        ...formData,
        experience_years: parseInt(formData.experienceYears) || 0,
        // salary: parseFloat(formData.salary) || 0,
        // is_active: true,
      });
      
      toast.success(teacher ? 'Teacher updated successfully!' : 'Teacher created successfully!');
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teacher_id">Teacher ID *</Label>
          <Input
            id="teacher_id"
            value={formData.teacher_id}
            onChange={(e) => handleChange('teacher_id', e.target.value)}
            placeholder="Enter teacher ID"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification</Label>
          <Input
            id="qualification"
            value={formData.qualification}
            onChange={(e) => handleChange('qualification', e.target.value)}
            placeholder="Enter qualification"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceYears">Experience (Years)</Label>
          <Input
            id="experienceYears"
            type="number"
            value={formData.experienceYears}
            onChange={(e) => handleChange('experienceYears', e.target.value)}
            placeholder="Enter years of experience"
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            type="number"
            value={formData.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            placeholder="Enter salary"
          />
        </div> */}
{/* 
        <div className="space-y-2">
          <Label htmlFor="joinDate">Join Date</Label>
          <Input
            id="joinDate"
            type="date"
            value={formData.joinDate}
            onChange={(e) => handleChange('joinDate', e.target.value)}
          />
        </div> */}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Enter address"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : teacher ? 'Update Teacher' : 'Create Teacher'}
        </Button>
      </div>
    </form>
  );
};


