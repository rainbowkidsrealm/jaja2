export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'parent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: number;
  userId: number;
  name: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  user?: User;
}

export interface Teacher {
  id: number;
  userId: number;
  teacherId: string;
  name: string;
  phone?: string;
  address?: string;
  qualification?: string;
  experienceYears: number;
  salary?: number;
  joinDate?: string;
  profileImage?: string;
  isActive: boolean;
  user?: User;
}

export interface Parent {
  id: number;
  userId: number;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  profileImage?: string;
  user?: User;
  children?: Student[];
}

export interface Class {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  sections?: Section[];
  subjects?: Subject[];
}

export interface Section {
  id: number;
  classId: number;
  name: string;
  capacity: number;
  isActive: boolean;
  class?: Class;
  students?: Student[];
}

export interface Subject {
  id: number;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
}

export interface Student {
  id: number;
  studentId: string;
  name: string;
  classId?: number;
  sectionId?: number;
  parentId?: number;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  phone?: string;
  email?: string;
  admissionDate?: string;
  profileImage?: string;
  isActive: boolean;
  class?: Class;
  section?: Section;
  parent?: Parent;
}

export interface Mark {
  id: number;
  studentId: number;
  subjectId: number;
  classId: number;
  examType: 'quiz' | 'assignment' | 'midterm' | 'final' | 'project';
  marksObtained: number;
  totalMarks: number;
  examDate?: string;
  remarks?: string;
  createdBy: number;
  student?: Student;
  subject?: Subject;
  class?: Class;
}

export interface Attendance {
  id: number;
  studentId: number;
  classId: number;
  sectionId: number;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
  markedBy: number;
  student?: Student;
  class?: Class;
  section?: Section;
}

export interface Homework {
  id: number;
  title: string;
  description?: string;
  classId: number;
  sectionId: number;
  subjectId: number;
  assignedDate: string;
  dueDate: string;
  assignedBy: number;
  isActive: boolean;
  class?: Class;
  section?: Section;
  subject?: Subject;
  teacher?: Teacher;
  submissions?: HomeworkSubmission[];
}

export interface HomeworkSubmission {
  id: number;
  homeworkId: number;
  studentId: number;
  submissionText?: string;
  fileUrl?: string;
  submittedAt?: string;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  grade?: string;
  remarks?: string;
  homework?: Homework;
  student?: Student;
}

export interface Message {
  id: number;
  title: string;
  content: string;
  senderId: number;
  senderType: 'admin' | 'teacher';
  recipientType: 'all_parents' | 'class_parents' | 'specific_parent';
  classId?: number;
  sectionId?: number;
  parentId?: number;
  isUrgent: boolean;
  sentAt: string;
  isRead?: boolean;
  readAt?: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'attendance' | 'marks' | 'homework' | 'announcement' | 'general';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalParents?: number;
  totalClasses?: number;
  presentToday?: number;
  absentToday?: number;
  pendingHomework?: number;
  unreadMessages?: number;
}

export interface AuthState {
  user: User | null;
  profile: Admin | Teacher | Parent | null;
  isAuthenticated: boolean;
  loading: boolean;
}