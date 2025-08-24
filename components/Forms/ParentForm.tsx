'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Parent } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';


interface ParentFormProps {
  parent?: Parent; // for editing
  onSubmit: (data: Partial<Parent>) => void; // callback for parent page
  onCancel: () => void; // close dialog
}


export const ParentForm: React.FC<ParentFormProps> = ({ parent, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    occupation: '',
    address: '',

  });

  const [loading, setLoading] = useState(false);

  // ✅ Update formData when parent prop changes
  useEffect(() => {
    if (parent) {
      setFormData({
        full_name: parent.parent_name || '',
        email: parent.email || '',
        phone: parent.phone || '',
        occupation: parent.occupation || '',
        address: parent.address || '',
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        occupation: '',
        address: '',
      });
    }
  }, [parent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData); // ✅ call back to parent page
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong!');
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
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
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
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            placeholder="Enter occupation"
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter password"
            required
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : parent ? 'Update Parent' : 'Create Parent'}
        </Button>
      </div>
    </form>
  );
};
