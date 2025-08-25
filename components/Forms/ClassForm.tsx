'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Class } from '@/types';
import { toast } from 'sonner';

interface ClassFormProps {
  classData?: Class;
  onSubmit: (data: {
    name: string;
    description?: string;
    sections: string; // <-- comma-separated string
    isActive: boolean;
  }) => void;
  onCancel: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  classData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    description: classData?.description || '',
    sections: classData
      ? (Array.isArray(classData.sections)
          ? classData.sections.split(',').join(',')
          : classData.sections || '')
      : '', // Handle undefined classData
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.sections) {
      toast.error('Class name and sections are required!');
      setLoading(false);
      return;
    }

    try {
      onSubmit({
        ...formData,
        isActive: true,
      });

      toast.success(classData ? 'Class updated successfully!' : 'Class created successfully!');
    } catch {
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
      <div className="space-y-2">
        <Label htmlFor="name">Class Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter class name (e.g., Grade 9)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter class description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sections">Sections *</Label>
        <Input
          id="sections"
          value={formData.sections}
          onChange={(e) => handleChange('sections', e.target.value)}
          placeholder="Comma-separated (e.g., A,B,C)"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : classData ? 'Update Class' : 'Create Class'}
        </Button>
      </div>
    </form>
  );
};