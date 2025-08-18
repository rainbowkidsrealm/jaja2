'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar,
  BarChart3,
  Users,
  GraduationCap,
  TrendingUp,
  PieChart,
  FileDown
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState('attendance');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';

  // Mock data for reports
  const attendanceData = {
    overall: 92,
    present: 1150,
    absent: 85,
    late: 45,
    total: 1280
  };

  const gradeDistribution = {
    'A+': 25,
    'A': 35,
    'B': 30,
    'C': 15,
    'D': 8,
    'F': 2
  };

  const reportTypes = [
    { value: 'attendance', label: 'Attendance Report', icon: Calendar },
    { value: 'grades', label: 'Grade Distribution', icon: BarChart3 },
    { value: 'student', label: 'Student Progress', icon: GraduationCap },
    { value: 'teacher', label: 'Teacher Performance', icon: Users },
    { value: 'homework', label: 'Homework Statistics', icon: FileText },
    { value: 'financial', label: 'Financial Summary', icon: TrendingUp },
  ];

  const availableReports = reportTypes.filter(report => {
    if (isAdmin) return true;
    if (isTeacher) return ['attendance', 'grades', 'student', 'homework'].includes(report.value);
    return false;
  });

  const AttendanceReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{attendanceData.present}</div>
              <div className="text-sm text-green-600">Present</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{attendanceData.absent}</div>
              <div className="text-sm text-red-600">Absent</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{attendanceData.late}</div>
              <div className="text-sm text-yellow-600">Late</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{attendanceData.overall}%</div>
              <div className="text-sm text-blue-600">Overall Rate</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Attendance Rate</span>
              <span className="text-sm text-muted-foreground">{attendanceData.overall}%</span>
            </div>
            <Progress value={attendanceData.overall} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const GradeReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Grade Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => {
              const percentage = Math.round((count / 115) * 100);
              return (
                <div key={grade} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Grade {grade}</span>
                    <span className="text-sm text-muted-foreground">{count} students ({percentage}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StudentReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Student Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">1,250</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-muted-foreground">Average Grade</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-muted-foreground">Promotion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReportType) {
      case 'attendance':
        return <AttendanceReport />;
      case 'grades':
        return <GradeReport />;
      case 'student':
        return <StudentReport />;
      default:
        return (
          <Card>
            <CardContent className="text-center py-12">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report Coming Soon</h3>
              <p className="text-muted-foreground">
                This report type is currently being developed.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Layout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Reports & Analytics</h2>
            <p className="text-muted-foreground">
              Generate and view comprehensive reports about school performance
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.2K</div>
              <p className="text-xs text-muted-foreground">Analyzed records</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <p className="text-xs text-muted-foreground">Data accuracy</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground">Live data</p>
            </CardContent>
          </Card>
        </div>

        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableReports.map((report) => {
                      const Icon = report.icon;
                      return (
                        <SelectItem key={report.value} value={report.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {report.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="grade9">Grade 9</SelectItem>
                    <SelectItem value="grade10">Grade 10</SelectItem>
                    <SelectItem value="grade11">Grade 11</SelectItem>
                    <SelectItem value="grade12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV Data</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                Save as Template
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">Reset Filters</Button>
                <Button>Generate Report</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {renderReportContent()}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Monthly Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Grade Analysis</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Teacher Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Performance</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}