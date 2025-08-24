"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Eye, Trash2, GraduationCap } from "lucide-react";
import { Teacher } from "@/types";
import { TeacherForm } from "@/components/Forms/TeacherForm";
import { toast } from "sonner";
import { addTeacherApi, deleteTeacherApi, getTeachersApi, updateTeachersApi } from "@/lib/api";

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>();
  const [deleteTeacher, setDeleteTeacher] = useState<Teacher | undefined>();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const data = await getTeachersApi();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast.error("Failed to fetch teachers");
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacher_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    setEditingTeacher(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsDialogOpen(true);
  };

const handleDeleteTeacher = async (teacher_id: string) => {
  try {
    await deleteTeacherApi(teacher_id);
    toast.success("Teacher deleted successfully!");
    await fetchTeachers(); // refresh list
  } catch (error: any) {
    toast.error(error.message || "Failed to delete teacher");
  }
};

  const confirmDelete = () => {
    if (deleteTeacher) {
      setTeachers((prev) => prev.filter((t) => t.id !== deleteTeacher.id));
      toast.success("Teacher deleted successfully!");
      setDeleteTeacher(undefined);
    }
  };

const handleFormSubmit = async (data: any) => {
  try {
    // Build payload for API
    const payload = {
      teacher_id:data.teacher_id || editingTeacher?.teacher_id || "",
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      qualification: data.qualification || "",
      experience_years: data.experienceYears ? parseInt(data.experienceYears) : 0, // always number
    };
console.log("Updating teacher:", payload);

    if (editingTeacher) {
      // Update existing teacher — include id in a separate object, not in payload
      await updateTeachersApi(payload);
      toast.success("Teacher updated successfully!");
    } else {
      // Add new teacher
      await addTeacherApi(payload);
      toast.success("Teacher added successfully!");
    }

    // Refresh teacher list
    await fetchTeachers();
  } catch (error: any) {
    toast.error(error.message || "Something went wrong!");
  } finally {
    setIsDialogOpen(false);
    setEditingTeacher(undefined);
  }
};





  return (
    <Layout title="Teachers Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Teachers</h2>
            <p className="text-muted-foreground">
              Manage teacher information and assignments
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2"
                onClick={handleAddTeacher}
              >
                <Plus className="h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Add/Edit Teacher Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
            </DialogHeader>
            <TeacherForm
              teacher={editingTeacher}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingTeacher(undefined);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteTeacher}
          onOpenChange={() => setDeleteTeacher(undefined)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteTeacher?.name}? This
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
              <CardTitle className="text-sm font-medium">
                Total Teachers
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachers.length}</div>
              <p className="text-xs text-muted-foreground">Active faculty</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teachers.length > 0
                  ? Math.round(
                      teachers.reduce((acc, t) => acc + t.experience_years, 0) /
                        teachers.length
                    )
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Years</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">
                {teachers.filter(t => new Date(t.join_date || '').getFullYear() === 2025).length}
              </div> */}
              <p className="text-xs text-muted-foreground">Recent hires</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">
                {teachers.filter(t => t.is_active).length}
              </div> */}
              <p className="text-xs text-muted-foreground">
                Currently teaching
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers by name, ID, or qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Teachers List</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingTeachers ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading teachers...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Contact</TableHead>
                      {/* <TableHead>Join Date</TableHead> */}
                      {/* <TableHead>Status</TableHead> */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.teacher_id}>
                        <TableCell className="font-medium">
                          {teacher.teacher_id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{teacher.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.qualification || "N/A"}</TableCell>
                        <TableCell>{teacher.experience_years} years</TableCell>
                        <TableCell>
                          <p className="text-sm">{teacher.phone || "N/A"}</p>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                     
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTeacher(teacher)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteTeacher(teacher.teacher_id)}
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
            {filteredTeachers.length === 0 && !loadingTeachers && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No teachers found matching your search.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

