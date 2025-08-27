export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'parent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mustChangePassword:boolean;
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
  teacher_id: string;
  name: string;
  email:string;
  phone?: string;
  address?: string;
  qualification?: string;
  experience_years: number;
  user?: User;
}

export interface Parent {
  id: number;
  userId: number;
  parent_name: string;  // 🔄 renamed
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
  sections?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Section {
  id: number;
  classId: number;
  name: string;
  capacity: number; // Maps to max_capacity from sections table
  isActive: boolean;
  enrolledStudents?: number; // Maps to enrolled_students from stored procedure
}


export interface Subject {
  id: number;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  teacherId?: number;   // foreign key to teacher
  teacherName?: string; // populated if you join with teacher table
  teacherEmail?: string;
  classId: number;
}

export interface Student {
  id: number;
  studentId: string;          // maps to student_id
  name: string;           // maps to full_name
  classId?: number;           // maps to class_id
  sectionId?: number;         // maps to section_id
  parentId?: number;          // maps to parent_id
  dateOfBirth?: string;       // maps to dob
  gender?: 'Male' | 'Female' | 'Other'; // match ENUM
  address?: string;
  phone?: string;
  email?: string;
  admissionDate?: string;     // maps to admission_date
  profileImage?: string;      // not in DB yet
  isActive?: boolean;         // only keep if you add to DB
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

// export interface Homework {
//   id: number;
//   title: string;
//   description?: string;
//   classId: number;
//   sectionId: number;
//   subjectId: number;
//   assignedDate: string;
//   dueDate: string;
//   assignedBy: number;
//   isActive: boolean;
//   class?: Class;
//   section?: Section;
//   subject?: Subject;
//   teacher?: Teacher;
//   submissions?: HomeworkSubmission[];
// }


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
  class: { id: number; name: string; isActive: boolean };
  section: { id: number; classId: number; name: string; capacity: number; isActive: boolean };
  subject: { id: number; name: string; code: string; isActive: boolean };
  teacher: Teacher;
  submissions: HomeworkSubmission[];
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