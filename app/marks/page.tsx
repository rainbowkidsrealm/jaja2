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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Edit,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Mark } from '@/types';
import { MarkForm } from '@/components/Forms/MarkForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  getMarksApi,
  getClassesForMarksApi,
  getSubjectsForMarksApi,
} from '@/lib/api';

export default function MarksPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | undefined>();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const isTeacher = user?.role === 'teacher';
  const isParent = user?.role === 'parent';

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [classRes, subjectRes] = await Promise.all([
          getClassesForMarksApi(),
          getSubjectsForMarksApi(),
        ]);
        setClasses(classRes);
        setSubjects(subjectRes);
      } catch (err) {
        toast.error('Failed to load filters');
      }
    };
    fetchFilters();
  }, []);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const data = await getMarksApi();
      const transformedMarks = data.map((item: any) => ({
        id: item.id,
        student: { id: item.student.id, name: item.student.name },
        subject: { id: item.subject.id, name: item.subject.name },
        class: { id: item.class.id, name: item.class.name },
        examType: item.examType,
        marksObtained: parseFloat(item.marksObtained) || 0,
        totalMarks: parseFloat(item.totalMarks) || 0,
        examDate: item.examDate,
        remarks: item.remarks,
      }));
      setMarks(transformedMarks);
    } catch (err) {
      toast.error('Failed to load marks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const handleFormSubmit = async () => {
    setIsDialogOpen(false);
    setEditingMark(undefined);
    fetchMarks();
  };

  const handleEditMark = (mark: Mark) => {
    setEditingMark(mark);
    setIsDialogOpen(true);
  };

  const handleAddMark = () => {
    setEditingMark(undefined);
    setIsDialogOpen(true);
  };

  const getPercentage = (obtained: number, total: number) =>
    Math.round((obtained / total) * 100) || 0;
  const getGrade = (percentage: number) =>
    percentage >= 90
      ? 'A+'
      : percentage >= 80
      ? 'A'
      : percentage >= 70
      ? 'B'
      : percentage >= 60
      ? 'C'
      : percentage >= 50
      ? 'D'
      : 'F';
  const getGradeColor = (grade: string) =>
    grade === 'A+' || grade === 'A'
      ? 'text-green-600 bg-green-50'
      : grade === 'B'
      ? 'text-blue-600 bg-blue-50'
      : grade === 'C'
      ? 'text-yellow-600 bg-yellow-50'
      : grade === 'D'
      ? 'text-orange-600 bg-orange-50'
      : 'text-red-600 bg-red-50';
  const getExamTypeColor = (type: string) =>
    type === 'quiz'
      ? 'bg-blue-100 text-blue-800'
      : type === 'assignment'
      ? 'bg-green-100 text-green-800'
      : type === 'midterm'
      ? 'bg-purple-100 text-purple-800'
      : type === 'final'
      ? 'bg-red-100 text-red-800'
      : type === 'project'
      ? 'bg-orange-100 text-orange-800'
      : 'bg-gray-100 text-gray-800';

  const filteredMarks = marks.filter((mark) => {
    const matchesSearch =
      (mark.student?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (mark.subject?.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === 'all' || mark.class?.id?.toString() === selectedClass;
    const matchesSubject =
      selectedSubject === 'all' ||
      mark.subject?.id?.toString() === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  return (
    <Layout title="Marks Management">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {isTeacher
                ? 'Marks Management'
                : isParent
                ? "Student Marks"
                : 'Marks Overview'}
            </h2>
            <p className="text-muted-foreground">
              {isTeacher
                ? 'Add and manage student marks and grades'
                : isParent
                ? "View your child's academic performance"
                : 'Monitor academic performance across all students'}
            </p>
          </div>
          {isTeacher && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={handleAddMark}>
                  <Plus className="h-4 w-4" /> Add Marks
                </Button>
              </DialogTrigger>
            </Dialog>
          )}
        </div>

        {/* Add/Edit Mark Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMark ? 'Edit Marks' : 'Add New Marks'}
              </DialogTitle>
            </DialogHeader>
            <MarkForm
              mark={editingMark}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingMark(undefined);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Marks Entries
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marks.length}</div>
              <p className="text-xs text-muted-foreground">All assessments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marks.length
                  ? Math.round(
                      marks.reduce(
                        (acc, mark) =>
                          acc + getPercentage(mark.marksObtained, mark.totalMarks),
                        0
                      ) / marks.length
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-green-600">Above average</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Passing Rate
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marks.length
                  ? Math.round(
                      (marks.filter((mark) => getPercentage(mark.marksObtained, mark.totalMarks) >= 50)
                        .length /
                        marks.length) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-blue-600">Overall pass rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student or subject..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Marks Table */}
        <Card>
          <CardHeader>
            <CardTitle>Marks Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMarks.length > 0 ? (
                  filteredMarks.map((mark) => {
                    const percentage = getPercentage(mark.marksObtained, mark.totalMarks);
                    const grade = getGrade(percentage);
                    return (
                      <TableRow key={mark.id}>
                        <TableCell>{mark.student?.name}</TableCell>
                        <TableCell>{mark.class?.name}</TableCell>
                        <TableCell>{mark.subject?.name}</TableCell>
                        <TableCell>
                          <Badge className={getExamTypeColor(mark.examType)}>
                            {mark.examType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {mark.marksObtained}/{mark.totalMarks}
                            </span>
                            <Progress value={percentage} className="w-20 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(grade)}>{grade}</Badge>
                        </TableCell>
                        <TableCell>
                          {mark.examDate
                            ? new Date(mark.examDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>{mark.remarks || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditMark(mark)}
                              disabled={!isTeacher}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No marks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
