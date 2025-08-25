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

export default function SubjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [deleteSubject, setDeleteSubject] = useState<Subject | undefined>();

  // Mock data - replace with actual API calls
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 1,
      name: 'Mathematics',
      code: 'MATH',
      description: 'Advanced mathematics including algebra, geometry, and calculus',
      isActive: true,
    },
    {
      id: 2,
      name: 'Physics',
      code: 'PHY',
      description: 'Classical and modern physics concepts',
      isActive: true,
    },
    {
      id: 3,
      name: 'Chemistry',
      code: 'CHEM',
      description: 'Organic and inorganic chemistry',
      isActive: true,
    },
    {
      id: 4,
      name: 'Biology',
      code: 'BIO',
      description: 'Life sciences and biological processes',
      isActive: true,
    },
    {
      id: 5,
      name: 'English',
      code: 'ENG',
      description: 'English language and literature',
      isActive: true,
    },
    {
      id: 6,
      name: 'History',
      code: 'HIST',
      description: 'World history and cultural studies',
      isActive: true,
    },
    {
      id: 7,
      name: 'Computer Science',
      code: 'CS',
      description: 'Programming, algorithms, and computer systems',
      isActive: true,
    },
    {
      id: 8,
      name: 'Economics',
      code: 'ECON',
      description: 'Micro and macroeconomics principles',
      isActive: false,
    },
  ]);

  const filteredSubjects = subjects.filter(subject =>
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

  const confirmDelete = () => {
    if (deleteSubject) {
      setSubjects(prev => prev.filter(s => s.id !== deleteSubject.id));
      toast.success('Subject deleted successfully!');
      setDeleteSubject(undefined);
    }
  };

  const handleFormSubmit = (data: Partial<Subject>) => {
    if (editingSubject) {
      // Update existing subject
      setSubjects(prev => prev.map(s => 
        s.id === editingSubject.id 
          ? { ...s, ...data, id: editingSubject.id }
          : s
      ));
    } else {
      // Add new subject
      const newSubject: Subject = {
      //  id: Math.max(...students.map(s => s.id), 0) + 1,
        ...data as Subject,
        isActive: true,
      };
      setSubjects(prev => [...prev, newSubject]);
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

  return (
    <Layout title="Subjects Management">
      <div className="space-y-6">
        {/* Header Section */}
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

        {/* Add/Edit Subject Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
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

        {/* Delete Confirmation Dialog */}
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

        {/* Stats Cards */}
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
              <div className="text-2xl font-bold">
                {subjects.filter(s => s.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground">Currently taught</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Science Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">STEM subjects</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Other Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Languages & Arts</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
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

        {/* Subjects Grid View */}
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
                  <Badge variant={subject.isActive ? 'default' : 'secondary'}>
                    {subject.isActive ? 'Active' : 'Inactive'}
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditSubject(subject)}
                    >
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

        {filteredSubjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No subjects found matching your search.</p>
            </CardContent>
          </Card>
        )}

        {/* Subjects Table View (Alternative) */}
        <Card className="hidden">
          <CardHeader>
            <CardTitle>Subjects List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject, index) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getSubjectColor(index)}`}>
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{subject.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{subject.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-xs truncate">{subject.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.isActive ? 'default' : 'secondary'}>
                          {subject.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}