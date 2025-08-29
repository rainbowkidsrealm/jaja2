"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
  Search,
  LogIn,
  LogOut,
  Plus,
  Eye,
  Users,
  Timer,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EntryExitForm } from "@/components/Forms/EntryExitForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getclassesforstudents, getStudentEntryExitApi } from "@/lib/api"; // Adjust path to your API file

interface EntryExitRecord {
  id: number;
  studentId: number;
  studentName: string;
  studentIdNumber: string;
  className: string;
  sectionName: string;
  entryTime?: string;
  exitTime?: string;
  date: string;
  status: "entered" | "exited" | "absent";
  lateEntry?: boolean;
  earlyExit?: boolean;
}

interface Class {
  id: number;
  name: string;
}

export default function EntryExitPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedClass, setSelectedClass] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const [entryExitRecords, setEntryExitRecords] = useState<EntryExitRecord[]>(
    []
  );
  const [classes, setClasses] = useState<Class[]>([]);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getclassesforstudents();
        setClasses(response || []);
      } catch (error) {
        toast.error("Failed to fetch classes");
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch entry/exit records when date or class changes
  // Fetch entry/exit records when date or class changes
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // call API which returns parsed JSON array (see api.ts)
        const data = await getStudentEntryExitApi(
          selectedDate,
          selectedClass !== "all" ? parseInt(selectedClass) : undefined,
          undefined
        );

        // map SQL columns (be robust to uppercase/lowercase column names)
        const records = (data || []).map((r: any) => {
          const Id = r.Id ?? r.id;
          const StudentId =
            r.studentId ?? r.StudentId ?? r.studentID ?? r.studentid;
          const Name = r.name ?? r.Name ?? r.studentName ?? r.StudentName;
          const ClassName = r.ClassName ?? r.className ?? r.class;
          const SectionName = r.SectionName ?? r.sectionName ?? r.section;
          const EntryTime = r.EntryTime ?? r.entryTime ?? r.entry_time;
          const ExitTime = r.ExitTime ?? r.exitTime ?? r.exit_time;
          const Status = r.Status ?? r.status;
          const CreatedAt = r.CreatedAt ?? r.createdAt ?? r.date;

          return {
            id: Id,
            studentId: StudentId,
            studentName: Name,
            studentIdNumber: StudentId, // <-- if you have a separate idNumber, map that here
            className: ClassName,
            sectionName: SectionName,
            entryTime: EntryTime ? String(EntryTime).slice(11, 16) : undefined,
            exitTime: ExitTime ? String(ExitTime).slice(11, 16) : undefined,
            date: CreatedAt ? String(CreatedAt).slice(0, 10) : selectedDate,
            status:
              Status && String(Status).toUpperCase() === "ENTRY"
                ? "entered"
                : Status && String(Status).toUpperCase() === "EXIT"
                ? "exited"
                : "absent",
            lateEntry: EntryTime
              ? isLateEntry(String(EntryTime).slice(11, 16))
              : false,
            earlyExit: ExitTime
              ? isEarlyExit(String(ExitTime).slice(11, 16))
              : false,
          } as EntryExitRecord;
        });

        setEntryExitRecords(records);
      } catch (error) {
        toast.error("Failed to fetch entry/exit records");
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, [selectedDate, selectedClass]);

  const filteredRecords = entryExitRecords.filter((record) => {
    const studentName = String(record.studentName || ""); // normalize
    const studentIdNumber = String(
      record.studentId || record.studentIdNumber || ""
    );

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      record.date === selectedDate;

    return matchesSearch && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "entered":
        return <LogIn className="h-4 w-4" />;
      case "exited":
        return <LogOut className="h-4 w-4" />;
      case "absent":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entered":
        return "bg-blue-100 text-blue-800";
      case "exited":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isLateEntry = (time: string) => {
    const entryTime = new Date(`2000-01-01T${time}`);
    const lateThreshold = new Date("2000-01-01T08:30:00");
    return entryTime > lateThreshold;
  };

  const isEarlyExit = (time: string) => {
    const exitTime = new Date(`2000-01-01T${time}`);
    const earlyThreshold = new Date("2000-01-01T15:00:00");
    return exitTime < earlyThreshold;
  };

  const getEntryExitStats = () => {
    const total = filteredRecords.length;
    const entered = filteredRecords.filter(
      (r) => r.status === "entered"
    ).length;
    const exited = filteredRecords.filter((r) => r.status === "exited").length;
    const absent = filteredRecords.filter((r) => r.status === "absent").length;
    const lateEntries = filteredRecords.filter((r) => r.lateEntry).length;
    const earlyExits = filteredRecords.filter((r) => r.earlyExit).length;
    const presentRate =
      total > 0 ? Math.round(((entered + exited) / total) * 100) : 0;

    return {
      total,
      entered,
      exited,
      absent,
      lateEntries,
      earlyExits,
      presentRate,
    };
  };

  const stats = getEntryExitStats();

  const handleAddEntryExit = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    // Add new entry/exit record to state
    const newRecord: EntryExitRecord = {
      id: Math.max(...entryExitRecords.map((r) => r.id), 0) + 1,
      ...data,
      className: classes.find((c) => c.name === data.class)?.name || data.class,
      sectionName: data.section,
    };
    setEntryExitRecords((prev) => [...prev, newRecord]);
    setIsDialogOpen(false);
    toast.success("Entry/Exit record updated successfully!");
  };

  const formatTime = (time?: string) => {
    if (!time) return "-";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (entryTime?: string, exitTime?: string) => {
    if (!entryTime || !exitTime) return "-";

    const entry = new Date(`2000-01-01T${entryTime}`);
    const exit = new Date(`2000-01-01T${exitTime}`);
    const diffMs = exit.getTime() - entry.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMinutes}m`;
  };

  const isTeacher = user?.role === "teacher";

  return (
    <Layout title="Entry/Exit Tracking">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Entry/Exit Tracking</h2>
            <p className="text-muted-foreground">
              Track student entry and exit times throughout the day
            </p>
          </div>
          {isTeacher && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  onClick={handleAddEntryExit}
                >
                  <Plus className="h-4 w-4" />
                  Mark Entry/Exit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Mark Student Entry/Exit</DialogTitle>
                </DialogHeader>
                <EntryExitForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Tracked today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Currently In
              </CardTitle>
              <LogIn className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.entered}
              </div>
              <p className="text-xs text-muted-foreground">In school</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exited</CardTitle>
              <LogOut className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.exited}
              </div>
              <p className="text-xs text-muted-foreground">Left school</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.absent}
              </div>
              <p className="text-xs text-muted-foreground">Not present</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Late Entries
              </CardTitle>
              <Timer className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.lateEntries}
              </div>
              <p className="text-xs text-muted-foreground">After 8:30 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Early Exits</CardTitle>
              <Timer className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.earlyExits}
              </div>
              <p className="text-xs text-muted-foreground">Before 3:00 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Rate Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Presence Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Students Present</span>
                <span className="text-sm text-muted-foreground">
                  {stats.presentRate}%
                </span>
              </div>
              <Progress value={stats.presentRate} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {stats.entered}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Currently In
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {stats.exited}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Completed Day
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {stats.absent}
                  </div>
                  <div className="text-xs text-muted-foreground">Absent</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id.toString()}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Entry/Exit Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Entry/Exit Records - {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Exit Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    {isTeacher && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getStatusIcon(record.status)}
                          </div>
                          <div>
                            <p className="font-medium">{record.studentName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{record.studentIdNumber}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{record.className}</p>
                          <p className="text-sm text-muted-foreground">
                            Section {record.sectionName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p
                          className={
                            record.lateEntry
                              ? "text-orange-600 font-medium"
                              : ""
                          }
                        >
                          {formatTime(record.entryTime)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p
                          className={
                            record.earlyExit
                              ? "text-purple-600 font-medium"
                              : ""
                          }
                        >
                          {formatTime(record.exitTime)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {calculateDuration(record.entryTime, record.exitTime)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {String(record.status || "")
                            .charAt(0)
                            .toUpperCase() +
                            String(record.status || "")
                              .slice(1)
                              .toLowerCase()}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-1">
                          {record.lateEntry && (
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-200"
                            >
                              Late
                            </Badge>
                          )}
                          {record.earlyExit && (
                            <Badge
                              variant="outline"
                              className="text-purple-600 border-purple-200"
                            >
                              Early
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      {isTeacher && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No entry/exit records found for the selected date and
                  criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
