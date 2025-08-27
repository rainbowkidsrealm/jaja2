'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { getclassesforstudents, getParentsApi, getSectionsApi } from "@/lib/api";
import { Student } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';


interface StudentFormProps {
  student?: Student;
  onSubmit: (data: Partial<Student>) => void;
  onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    studentId: student?.studentId || '',
    fullName: student?.name || '',
    classId: student?.classId?.toString() || '',
    sectionId: student?.sectionId?.toString() || '',
    parentId: student?.parentId?.toString() || '',
    dateOfBirth: student?.dateOfBirth || '',
    gender: student?.gender || '',
    address: student?.address || '',
    phone: student?.phone || '',
    email: student?.email || '',
    admissionDate: student?.admissionDate || '',
  });

  const [loading, setLoading] = useState(false);

  // 🔹 hooks for API

  const [classes, setClasses] = useState<any[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    getclassesforstudents().then(setClasses).catch((err) => console.error(err));
    getParentsApi().then(setParents).catch((err) => console.error(err));
    getSectionsApi().then(setSections).catch((err) => console.error(err));
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<Student> = {
        studentId: formData.studentId,
        name: formData.fullName,
        classId: formData.classId ? parseInt(formData.classId) : undefined,
        sectionId: formData.sectionId ? parseInt(formData.sectionId) : undefined,
        parentId: formData.parentId ? parseInt(formData.parentId) : undefined,
        gender: formData.gender
          ? (formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)) as Student["gender"]
          : undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        admissionDate: formData.admissionDate || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
      };

      // 👉 don't swallow errors here
      await onSubmit(payload);

      // ✅ only toast success if no error was thrown
      toast.success(student ? "Student updated successfully!" : "Student created successfully!");
    } catch (error: any) {
      // 👉 handle only UI-level validation here
      if (error?.response?.status === 409 || error?.message?.includes("Duplicate entry")) {
        toast.error("This Student ID already exists. Please choose another.");
      } else {
        toast.error("Something went wrong!");
      }
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
        {/* Student ID */}
        {/* Student ID */}
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID *</Label>
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            placeholder="Enter student ID"
            required
            readOnly={!!student}   // 👈 read-only if editing
            className={student ? "bg-gray-100 cursor-not-allowed" : ""}
          />
        </div>


        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Class */}
        <div className="space-y-2">
          <Label htmlFor="class">Class *</Label>
          <Select
            value={formData.classId}
            onValueChange={(value) => {
              handleChange('classId', value);
              handleChange('sectionId', ''); // reset section
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map(cls => (
                <SelectItem key={cls.id} value={cls.id.toString()}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section */}
        <div className="space-y-2">
          <Label htmlFor="section">Section *</Label>
          <Select
            value={formData.sectionId}
            onValueChange={(value) => handleChange('sectionId', value)}
            disabled={!formData.classId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections
                .filter(section => section.classId?.toString() === formData.classId)
                .map(section => (
                  <SelectItem key={section.id} value={section.id.toString()}>
                    {section.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Parent */}
        <div className="space-y-2">
          <Label htmlFor="parent">Parent *</Label>
          <Select
            value={formData.parentId}
            onValueChange={(value) => handleChange('parentId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select parent" />
            </SelectTrigger>
            <SelectContent>
              {parents.map(p => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.parent_name}
                </SelectItem>
              ))} {/* Assuming parent_name is the field for parent's name */}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DOB */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
        </div>

        {/* Admission Date */}
        <div className="space-y-2">
          <Label htmlFor="admissionDate">Admission Date</Label>
          <Input
            id="admissionDate"
            type="date"
            value={formData.admissionDate}
            onChange={(e) => handleChange('admissionDate', e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>

      {/* Address */}
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
          {loading ? 'Saving...' : student ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
};
