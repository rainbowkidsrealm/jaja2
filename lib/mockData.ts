// Mock data for development and testing
import { User, Admin, Teacher, Parent, Student, Class, Subject, Mark, Attendance, Homework, Message } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  { 
    id: 1, 
    email: 'admin@school.com', 
    name: 'Admin User', 
    role: 'admin', 
    isActive: true, 
    createdAt: '2024-01-01', 
    updatedAt: '2024-01-01',
    mustChangePassword: false,
  },
  { 
    id: 2, 
    email: 'teacher@school.com', 
    name: 'Teacher User', 
    role: 'teacher', 
    isActive: true, 
    createdAt: '2024-01-01', 
    updatedAt: '2024-01-01',
    mustChangePassword: false,
  },
  { 
    id: 3, 
    email: 'parent@school.com', 
    name: 'Parent User', 
    role: 'parent', 
    isActive: true, 
    createdAt: '2024-01-01', 
    updatedAt: '2024-01-01',
    mustChangePassword: false,
  },
];

// Mock Classes
export const mockClasses: Class[] = [
  {
    id: 1,
    name: 'Grade 9',
    description: 'Ninth grade students',
    isActive: true,
    sections: 'A,B', // Changed from array to comma-separated string
  },
  {
    id: 2,
    name: 'Grade 10',
    description: 'Tenth grade students',
    isActive: true,
    sections: 'A,B', // Changed from array to comma-separated string
  },
];

// Mock Subjects
export const mockSubjects: Subject[] = [
  { id: 1, name: 'Mathematics', code: 'MATH', description: 'Advanced mathematics', isActive: true },
  { id: 2, name: 'Physics', code: 'PHY', description: 'Physics concepts', isActive: true },
  { id: 3, name: 'Chemistry', code: 'CHEM', description: 'Chemistry fundamentals', isActive: true },
  { id: 4, name: 'English', code: 'ENG', description: 'English language', isActive: true },
];

// Mock Teachers
export const mockTeachers: Teacher[] = [
  {
    id: 1,
    teacher_id: 'T001',
    name: 'Jane Smith',
    email: 'jane.smith@school.com',
    phone: '+1234567890',
    qualification: 'M.Sc Mathematics',
    experience_years: 5, // Matches index.ts (experience_years)
    // isActive: true,
  },
  {
    id: 2,
    teacher_id: 'T002',
    name: 'John Doe',
    email: 'john.doe@school.com',
    phone: '+1234567891',
    qualification: 'M.A English',
    experience_years: 8, // Matches index.ts (experience_years)
    // isActive: true,
  },
];

// Mock Parents
export const mockParents: Parent[] = [
  {
    id: 1,
    userId: 3,
    parent_name: 'Robert Johnson', // Changed from name to parent_name
    email: 'robert.johnson@school.com',
    phone: '+1234567890',
    occupation: 'Software Engineer',
    address: '123 Main St, City',
  },
  {
    id: 2,
    userId: 5,
    parent_name: 'Mary Smith', // Changed from name to parent_name
    email: 'mary.smith@school.com',
    phone: '+1234567891',
    occupation: 'Doctor',
    address: '456 Oak Ave, City',
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: 1,
    studentId: 'STU001',
    name: 'Alice Johnson',
    classId: 1,
    sectionId: 1,
    parentId: 1,
    dateOfBirth: '2008-05-15',
    gender: 'female',
    address: '123 Main St, City',
    phone: '+1234567890',
    email: 'alice@example.com',
    admissionDate: '2023-08-01',
    isActive: true,
    class: mockClasses[0],
    section: undefined, // sections is a string now, so section is not applicable
    parent: mockParents[0],
  },
  {
    id: 2,
    studentId: 'STU002',
    name: 'Bob Smith',
    classId: 1,
    sectionId: 2,
    parentId: 2,
    dateOfBirth: '2008-03-20',
    gender: 'male',
    address: '456 Oak Ave, City',
    phone: '+1234567891',
    email: 'bob@example.com',
    admissionDate: '2023-08-01',
    isActive: true,
    class: mockClasses[0],
    section: undefined, // sections is a string now, so section is not applicable
    parent: mockParents[1],
  },
];

// Mock Marks
export const mockMarks: Mark[] = [
  {
    id: 1,
    studentId: 1,
    subjectId: 1,
    classId: 1,
    examType: 'midterm',
    marksObtained: 85,
    totalMarks: 100,
    examDate: '2024-01-15',
    createdBy: 1,
    student: mockStudents[0],
    subject: mockSubjects[0],
    class: mockClasses[0],
  },
];

// Mock Attendance
export const mockAttendance: Attendance[] = [
  {
    id: 1,
    studentId: 1,
    classId: 1,
    sectionId: 1,
    date: '2024-01-20',
    status: 'present',
    markedBy: 1,
    student: mockStudents[0],
    class: mockClasses[0],
    section: undefined, // sections is a string now, so section is not applicable
  },
];

// Mock Homework
export const mockHomework: Homework[] = [
  {
    id: 1,
    title: 'Algebra Practice Problems',
    description: 'Complete exercises 1-20 from chapter 5',
    classId: 1,
    sectionId: 1,
    subjectId: 1,
    assignedDate: '2024-01-15',
    dueDate: '2024-01-22',
    assignedBy: 1,
    isActive: true,
    class: { id: 1, name: 'Grade 9', isActive: true },
    section: { id: 1, classId: 1, name: 'A', capacity: 30, isActive: true },
    subject: { id: 1, name: 'Mathematics', code: 'MATH', isActive: true },
    teacher: mockTeachers[0],
    submissions: [],
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: 1,
    title: 'Parent-Teacher Meeting',
    content: 'Meeting scheduled for next week',
    senderId: 1,
    senderType: 'teacher',
    recipientType: 'class_parents',
    classId: 1,
    isUrgent: false,
    sentAt: '2024-01-22T10:00:00Z',
    isRead: false,
  },
];