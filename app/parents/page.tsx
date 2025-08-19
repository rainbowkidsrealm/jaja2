'use client';

import { ParentForm } from '@/components/Forms/ParentForm';
import { Layout } from '@/components/Layout/Layout';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Parent } from '@/types';
import { Edit, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getParentsApi,
  createParentApi,
} from '@/lib/api';

export default function ParentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | undefined>();
  const [deleteParent, setDeleteParent] = useState<Parent | undefined>();

  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch parents from API
  const fetchParents = async () => {
    try {
      setLoading(true);
      const data = await getParentsApi();
      setParents(data);
    } catch (error) {
      console.error('Failed to fetch parents:', error);
      toast.error('Failed to fetch parents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // Filter parents by search term
  const filteredParents = parents.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const confirmDelete = async () => {
    if (!deleteParent) return;

    try {
      //await deleteParentApi(deleteParent.id);
      setParents((prev) => prev.filter((p) => p.id !== deleteParent.id));
      toast.success('Parent deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete parent');
    } finally {
      setDeleteParent(undefined);
    }
  };

  // Called after form submit
  const handleFormSubmit = async (data: Partial<Parent>) => {
    try {
      if (editingParent) {
        // Update parent
        // await updateParentApi(editingParent.id, data);
        toast.success('Parent updated successfully!');
      } else {
        // Create new parent
        await createParentApi(data as any); // ✅ pass correct type
        toast.success('Parent created successfully!');
      }

      await fetchParents(); // ✅ refresh list immediately
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong!');
    } finally {
      setIsDialogOpen(false);
      setEditingParent(undefined);
    }
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
          <Button className="flex items-center gap-2" onClick={handleAddParent}>
            <Plus className="h-4 w-4" />
            Add Parent
          </Button>
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
        <AlertDialog
          open={!!deleteParent}
          onOpenChange={() => setDeleteParent(undefined)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Parent</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteParent?.full_name}? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
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
                {parents.filter((p) => p.children?.length === 1).length}
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
                {parents.filter((p) => (p.children?.length || 0) > 1).length}
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
                placeholder="Search parents by name, occupation, or email..."
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
                            <p className="font-medium">{parent.full_name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{parent.occupation}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{parent.phone}</p>
                          <p className="text-xs text-muted-foreground">{parent.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {parent.children?.map((child) => (
                            <Badge
                              key={child.id}
                              variant="secondary"
                              className="text-xs"
                            >
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

            {!loading && filteredParents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No parents found matching your search.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
