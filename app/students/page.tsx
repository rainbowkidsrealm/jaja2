'use client';

import { StudentForm } from '@/components/Forms/StudentForm';
import { Layout } from '@/components/Layout/Layout';
import { useEffect, useMemo, useState } from 'react';

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
  DialogTitle
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
import { createStudentApi, deactivateStudentApi, getStudentsApi, updateStudentApi } from '@/lib/api';
import { Edit, GraduationCap, Plus, Search, Trash2, Users } from 'lucide-react';

// Shape returned by SP Get_students_list()
type ApiStudent = {
  id: number;
  studentId: string | null;
  name: string | null;              // UI uses this
  studentName?: string | null;      // API gives this
  dateOfBirth: string | null;
  className: string | null;
  sectionName: string | null;
  parentId: number | null;
  parentName: string | null;
  gender: 'male' | 'female' | string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  parentPhone?: string | null;      // API may give these
  parentEmail?: string | null;
  status: string;
  admissionDate?: string | null;
};


export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<ApiStudent | undefined>();
  const [deleteStudent, setDeleteStudent] = useState<ApiStudent | undefined>();
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await getStudentsApi(); // { count, data }
      console.log("Fetched students:", data);

      const normalized = (data as any[]).map((s) => ({
        ...s,
        name: s.name ?? s.studentName ?? '',
        contactPhone: s.phone ?? s.contactPhone ?? s.parentPhone ?? '',
        contactEmail: s.email ?? s.contactEmail ?? s.parentEmail ?? '',
        address: s.address ?? '',
        dateOfBirth: s.dateOfBirth ? s.dateOfBirth.split('T')[0] : null,      // 👈 only YYYY-MM-DD
        admissionDate: s.admissionDate ? s.admissionDate.split('T')[0] : null, // 👈 only YYYY-MM-DD
        status: s.isActive ? "Active" : "Inactive",
      }));


      setStudents(normalized as ApiStudent[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchStudents();
  }, []);



  const filteredStudents = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return students.filter(st => {
      const matchesSearch =
        (st.name ?? '').toLowerCase().includes(s) ||
        (st.studentId ?? '').toLowerCase().includes(s);

      const matchesClass =
        selectedClass === "all" || st.className === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  const handleAddStudent = () => {
    setEditingStudent(undefined);
    setIsDialogOpen(true);
  };

  const handleEditStudent = (student: ApiStudent) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };

  const handleDeleteStudent = (student: ApiStudent) => {
    setDeleteStudent(student);
  };

  const confirmDelete = async () => {
    if (deleteStudent) {
      try {
        await deactivateStudentApi(deleteStudent.id);

        // ✅ refetch to update UI
        await fetchStudents();

        setDeleteStudent(undefined);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingStudent) {
        // ✅ update student
        await updateStudentApi({ id: editingStudent.id, ...data });
      } else {
        // ✅ create student
        await createStudentApi(data);
      }

      // refetch after add/edit
      await fetchStudents();

      setIsDialogOpen(false);
      setEditingStudent(undefined);
    } catch (err) {
      throw err; // let StudentForm show toast
    }
  };


  const getGenderColor = (gender?: string | null) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cap = (g?: string | null) =>
    g ? g.charAt(0).toUpperCase() + g.slice(1) : 'N/A';

  const maleCount = students.filter(s => s.gender === 'male').length;
  const femaleCount = students.filter(s => s.gender === 'female').length;
  const newThisYear = students.filter(
    s => s.admissionDate && new Date(s.admissionDate).getFullYear() === new Date().getFullYear()
  ).length;

  return (
    <Layout title="Students Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Students</h2>
            <p className="text-muted-foreground">
              Manage student information and academic records
            </p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleAddStudent}>
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>

        {/* Add/Edit Student Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
            </DialogHeader>
            <StudentForm
              student={editingStudent as any}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingStudent(undefined);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteStudent} onOpenChange={() => setDeleteStudent(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Student</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteStudent?.name}? This action cannot be undone.
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
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Active students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Male Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maleCount}</div>
              <p className="text-xs text-muted-foreground">Male enrollment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Female Students</CardTitle>
              <Users className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{femaleCount}</div>
              <p className="text-xs text-muted-foreground">Female enrollment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newThisYear}</div>
              <p className="text-xs text-muted-foreground">Recent admissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* If you want dynamic classes, replace with a dropdown fed by API */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
                disabled={loading}
              >
                <option value="all">All Classes</option>
                {Array.from(new Set(students.map(s => s.className).filter(Boolean)))
                  .sort((a, b) => String(a).localeCompare(String(b))) // 🔥 ensures sorted
                  .map(cn => {
                    const className = String(cn); // ensure string
                    return (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    );
                  })}
              </select>

            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.studentId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.dateOfBirth &&
                                  new Date(student.dateOfBirth).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>{student.sectionName}</TableCell>
                        <TableCell>{student.parentName}</TableCell>
                        <TableCell>
                          <Badge className={getGenderColor(student.gender)}>
                            {cap(student.gender)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{student.contactPhone}</p>
                            <p className="text-xs text-muted-foreground">{student.contactEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{student.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteStudent(student)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No students found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}