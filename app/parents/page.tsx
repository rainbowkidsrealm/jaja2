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
import { Plus, Search, Edit, Eye, Trash2, Users } from 'lucide-react';
import { Parent } from '@/types';
import { ParentForm } from '@/components/Forms/ParentForm';
import { toast } from 'sonner';

export default function ParentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | undefined>();
  const [deleteParent, setDeleteParent] = useState<Parent | undefined>();

  // Mock data - replace with actual API calls
  const [parents, setParents] = useState<Parent[]>([
    {
      id: 1,
      userId: 5,
      name: 'Robert Johnson',
      phone: '+1234567890',
      occupation: 'Software Engineer',
      address: '123 Main St, City',
      children: [
        { id: 1, studentId: 'STU001', name: 'Alice Johnson', classId: 1, isActive: true }
      ]
    },
    {
      id: 2,
      userId: 6,
      name: 'Mary Smith',
      phone: '+1234567891',
      occupation: 'Doctor',
      address: '456 Oak Ave, City',
      children: [
        { id: 2, studentId: 'STU002', name: 'Bob Smith', classId: 1, isActive: true }
      ]
    },
    {
      id: 3,
      userId: 7,
      name: 'James Davis',
      phone: '+1234567892',
      occupation: 'Business Owner',
      address: '789 Pine Rd, City',
      children: [
        { id: 3, studentId: 'STU003', name: 'Carol Davis', classId: 2, isActive: true }
      ]
    },
  ]);

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.children?.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddParent = () => {
    setEditingParent(undefined);
    setIsDialogOpen(true);
  };

  const handleEditParent = (parent: Parent) => {
    setEditingParent(parent);
    setIsDialogOpen(true);
  };

  const handleDeleteParent = (parent: Parent) => {
    setDeleteParent(parent);
  };

  const confirmDelete = () => {
    if (deleteParent) {
      setParents(prev => prev.filter(p => p.id !== deleteParent.id));
      toast.success('Parent deleted successfully!');
      setDeleteParent(undefined);
    }
  };

  const handleFormSubmit = (data: Partial<Parent>) => {
    if (editingParent) {
      // Update existing parent
      setParents(prev => prev.map(p => 
        p.id === editingParent.id 
          ? { ...p, ...data, id: editingParent.id }
          : p
      ));
    } else {
      // Add new parent
      const newParent: Parent = {
        id: Math.max(...parents.map(p => p.id)) + 1,
        userId: Math.max(...parents.map(p => p.userId)) + 1,
        ...data as Parent,
      };
      setParents(prev => [...prev, newParent]);
    }
    setIsDialogOpen(false);
    setEditingParent(undefined);
  };

  return (
    <Layout title="Parents Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Parents</h2>
            <p className="text-muted-foreground">
              Manage parent information and contact details
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={handleAddParent}>
                <Plus className="h-4 w-4" />
                Add Parent
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Add/Edit Parent Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingParent ? 'Edit Parent' : 'Add New Parent'}
              </DialogTitle>
            </DialogHeader>
            <ParentForm
              parent={editingParent}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingParent(undefined);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteParent} onOpenChange={() => setDeleteParent(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Parent</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteParent?.name}? This action cannot be undone.
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
              <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parents.length}</div>
              <p className="text-xs text-muted-foreground">Registered parents</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Children</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parents.reduce((acc, p) => acc + (p.children?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Single Child</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parents.filter(p => p.children?.length === 1).length}
              </div>
              <p className="text-xs text-muted-foreground">Families</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Multiple Children</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parents.filter(p => (p.children?.length || 0) > 1).length}
              </div>
              <p className="text-xs text-muted-foreground">Families</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parents by name, occupation, or child name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Parents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Parents List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Children</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.map((parent) => (
                    <TableRow key={parent.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{parent.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{parent.occupation}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{parent.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {parent.children?.map((child) => (
                            <Badge key={child.id} variant="secondary" className="text-xs">
                              {child.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">{parent.address}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditParent(parent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteParent(parent)}
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
            
            {filteredParents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No parents found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}