'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Eye, Trash2, BookOpen } from 'lucide-react';
import { Subject } from '@/types';
import { SubjectForm } from '@/components/Forms/SubjectForm';
import { toast } from 'sonner';
import { createSubjectApi, getSubjectsApi, updateSubjectApi, deleteSubjectApi } from '@/lib/api';

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  const [deleteSubject, setDeleteSubject] = useState<Subject | undefined>(undefined);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await getSubjectsApi();
        // Map the API response to match the expected Subject type
        const mappedSubjects = fetchedSubjects.map((s: any) => ({
          ...s,
          isActive: s.is_active === 1 || s.is_active === true, // Convert to boolean
        }));
        setSubjects(mappedSubjects);
      } catch (err) {
        toast.error('Failed to fetch subjects');
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditingSubject(undefined);
    setIsDialogOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setIsDialogOpen(true);
  };

  const handleDeleteSubject = (subject: Subject) => {
    setDeleteSubject(subject);
  };

  const confirmDelete = async () => {
    if (deleteSubject) {
      try {
        await deleteSubjectApi(deleteSubject.id);
        setSubjects((prev) => prev.filter((s) => s.id !== deleteSubject.id));
        toast.success('Subject deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete subject');
        console.error("Delete error:", err);
      } finally {
        setDeleteSubject(undefined);
      }
    }
  };

  const handleFormSubmit = (data: Partial<Subject>) => {
    if (editingSubject && data.id) {
      setSubjects((prev) =>
        prev.map((s) => (s.id === data.id ? { ...s, ...data, isActive: data.isActive ?? s.isActive } : s))
      );
      toast.success('Subject updated successfully!');
    } else if (data.id) {
      setSubjects((prev) => [...prev, { ...data, isActive: true } as Subject]);
      toast.success('Subject created successfully!');
    }
    setIsDialogOpen(false);
    setEditingSubject(undefined);
  };

  const getSubjectColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-orange-100 text-orange-600',
      'bg-red-100 text-red-600',
      'bg-indigo-100 text-indigo-600',
      'bg-pink-100 text-pink-600',
      'bg-gray-100 text-gray-600',
    ];
    return colors[index % colors.length];
  };

  const activeSubjectsCount = subjects.filter((s) => s.isActive).length;

  return (
    <Layout title="Subjects Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Subjects</h2>
            <p className="text-muted-foreground">
              Manage subjects and their curriculum details
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={handleAddSubject}>
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
            </DialogHeader>
            <SubjectForm
              subject={editingSubject}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingSubject(undefined);
              }}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteSubject} onOpenChange={() => setDeleteSubject(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteSubject?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground">All subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubjectsCount}</div>
              <p className="text-xs text-muted-foreground">Currently taught</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Science Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subjects.filter((s) => ['MATH', 'PHY', 'CHEM', 'BIO'].includes(s.code || '')).length}
              </div>
              <p className="text-xs text-muted-foreground">STEM subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Other Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subjects.filter((s) => !['MATH', 'PHY', 'CHEM', 'BIO'].includes(s.code || '')).length}
              </div>
              <p className="text-xs text-muted-foreground">Languages & Arts</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects by name, code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Loading subjects...</p>
            </CardContent>
          </Card>
        ) : filteredSubjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No subjects found matching your search.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, index) => (
              <Card key={subject.id} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getSubjectColor(index)}`}>
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {subject.code}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={subject.isActive ? "default" : "secondary"}>
                      {subject.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {subject.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditSubject(subject)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteSubject(subject)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}