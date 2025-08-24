'use client';

import React, { useState, useEffect } from 'react';
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
import { Plus, Search, Edit, Eye, Trash2, School, Users } from 'lucide-react';
import { Class } from '@/types';
import  ClassForm  from '@/components/Forms/ClassForm';
import { toast } from 'sonner';
import {
  getClassesApi,
  createClassApi,
  updateClassApi,
  deleteClassApi,
} from '@/lib/api';

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | undefined>();
  const [deleteClass, setDeleteClass] = useState<Class | undefined>();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch classes from backend
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await getClassesApi();
      setClasses(data);
      if (data.length === 0) {
        console.log('No classes returned from API');
      } else {
        console.log('Classes data:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = () => {
    setEditingClass(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClass = (classData: Class) => {
    setEditingClass(classData);
    setIsDialogOpen(true);
  };

  const handleDeleteClass = (classData: Class) => {
    setDeleteClass(classData);
  };

  const confirmDelete = async () => {
    if (deleteClass) {
      try {
        await deleteClassApi(deleteClass.id);
        toast.success('Class deleted successfully!');
        fetchClasses();
      } catch {
        toast.error('Failed to delete class');
      } finally {
        setDeleteClass(undefined);
      }
    }
  };

const handleFormSubmit = async (data: Partial<Class>) => {
  try {
    // Transform sections if it's an array
    const payload = {
      name: data.name ?? "",
      description: data.description ?? "",
      sections: Array.isArray(data.sections)
        ? data.sections.map(s => s.name).join(",")
        : data.sections ?? "",
      isActive: data.isActive ?? true,
    };

    if (editingClass) {
      await updateClassApi(editingClass.id, payload);
      toast.success("Class updated successfully!");
    } else {
      await createClassApi(payload);
      toast.success("Class created successfully!");
    }

    setIsDialogOpen(false);
    setEditingClass(undefined);
    fetchClasses();
  } catch {
    toast.error("Error saving class");
  }
};

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalCapacity = (classItem: Class) => {
    let total = 0;
    if (Array.isArray(classItem.sections)) {
      total = classItem.sections.reduce((acc, section) => {
        const capacity = section.capacity || 0;
        console.log(`Section ${section.name} capacity: ${capacity} for class ${classItem.name}`);
        return acc + capacity;
      }, 0);
    }
    console.log(`Total capacity for ${classItem.name}: ${total}`);
    return total;
  };

  const getTotalSections = (classItem: Class) => {
    return classItem.sections?.length || 0;
  };

  return (
    <Layout title="Classes Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Classes</h2>
            <p className="text-muted-foreground">
              Manage classes and their sections
            </p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleAddClass}>
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        </div>

        {/* Add/Edit Class Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </DialogTitle>
            </DialogHeader>
            <ClassForm
              classData={editingClass}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingClass(undefined);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteClass} onOpenChange={() => setDeleteClass(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Class</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteClass?.name}? This action cannot be undone.
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
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground">Active classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classes.reduce((acc, c) => acc + getTotalSections(c), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classes.reduce((acc, c) => acc + getTotalCapacity(c), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Maximum students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average per Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(() => {
                  const totalCapacity = classes.reduce((acc, c) => acc + getTotalCapacity(c), 0);
                  const totalSections = classes.reduce((acc, c) => acc + getTotalSections(c), 0);
                  return totalSections > 0 ? Math.round(totalCapacity / totalSections) : 0;
                })()}
              </div>
              <p className="text-xs text-muted-foreground">Students capacity</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Classes List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : filteredClasses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No classes found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Sections</TableHead>
                      <TableHead>Total Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <School className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{classItem.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{classItem.description }</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(classItem.sections) && classItem.sections.length ? (
                              classItem.sections.map((section) => (
                                <Badge key={section.id} variant="secondary" className="text-xs">
                                  {section.name} ({section.capacity})
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary" className="text-xs">No sections</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-medium">{getTotalCapacity(classItem)}</p>
                            <p className="text-xs text-muted-foreground">
                              {getTotalSections(classItem)} sections
                              {getTotalSections(classItem) === 0 && ' (No sections)'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={classItem.isActive ? 'default' : 'secondary'}>
                            {classItem.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClass(classItem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClass(classItem)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}