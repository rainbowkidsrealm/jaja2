# School Management System

A comprehensive school management system built with Next.js, featuring role-based access control for Admins, Teachers, and Parents.

## Features

### 👤 User Roles

#### Admin
- Create, edit, update, delete Teachers and Parents details
- Manage system-wide settings (classes, sections, subjects)
- View system analytics and reports
- Manage school information and settings

#### Teacher
- Create, edit, update, delete Student details (linked to parents)
- Upload marks/grades for students (class & subject wise)
- Manage attendance (present/absent, class & section wise)
- Assign and manage homework for students
- Send announcements/updates/messages to parents
- View class and student analytics

#### Parent
- Login with email & password provided by the school
- View student details, marks, attendance, and homework
- Receive notifications/messages from teachers
- Track student progress and performance

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: JWT-based authentication
- **Database**: MySQL
- **Backend**: Node.js with Express
- **State Management**: React Context API
- **Icons**: Lucide React

## Database Schema (MySQL)

```sql
-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'parent') NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- School information
CREATE TABLE school_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin profiles
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Teacher profiles
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    qualification VARCHAR(255),
    experience_years INT DEFAULT 0,
    salary DECIMAL(10,2),
    join_date DATE,
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Parent profiles
CREATE TABLE parents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    occupation VARCHAR(255),
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Classes
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sections
CREATE TABLE sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    name VARCHAR(10) NOT NULL,
    capacity INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_class_section (class_id, name)
);

-- Subjects
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Class subjects (many-to-many relationship)
CREATE TABLE class_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    subject_id INT,
    teacher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_class_subject (class_id, subject_id)
);

-- Students
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    class_id INT,
    section_id INT,
    parent_id INT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    admission_date DATE,
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE SET NULL
);

-- Marks/Grades
CREATE TABLE marks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    subject_id INT,
    class_id INT,
    exam_type ENUM('quiz', 'assignment', 'midterm', 'final', 'project') NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    exam_date DATE,
    remarks TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES teachers(id) ON DELETE SET NULL
);

-- Attendance
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    class_id INT,
    section_id INT,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL,
    remarks TEXT,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_date (student_id, date)
);

-- Homework
CREATE TABLE homework (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id INT,
    section_id INT,
    subject_id INT,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    assigned_by INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES teachers(id) ON DELETE CASCADE
);

-- Homework submissions
CREATE TABLE homework_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    homework_id INT,
    student_id INT,
    submission_text TEXT,
    file_url VARCHAR(500),
    submitted_at TIMESTAMP,
    status ENUM('pending', 'submitted', 'late', 'graded') DEFAULT 'pending',
    grade VARCHAR(10),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (homework_id) REFERENCES homework(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_homework_student (homework_id, student_id)
);

-- Messages/Announcements
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sender_id INT,
    sender_type ENUM('admin', 'teacher') NOT NULL,
    recipient_type ENUM('all_parents', 'class_parents', 'specific_parent') NOT NULL,
    class_id INT NULL,
    section_id INT NULL,
    parent_id INT NULL,
    is_urgent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
);

-- Message recipients (for tracking read status)
CREATE TABLE message_recipients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message_id INT,
    parent_id INT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
    UNIQUE KEY unique_message_parent (message_id, parent_id)
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('attendance', 'marks', 'homework', 'announcement', 'general') NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_students_class_section ON students(class_id, section_id);
CREATE INDEX idx_marks_student_subject ON marks(student_id, subject_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_class_section_date ON attendance(class_id, section_id, date);
CREATE INDEX idx_homework_class_section ON homework(class_id, section_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
```

## Backend API Endpoints (Node.js/Express)

### Authentication Endpoints
```javascript
// POST /api/auth/login - User login
// POST /api/auth/logout - User logout
// POST /api/auth/refresh - Refresh JWT token
// GET /api/auth/profile - Get current user profile
```

### Admin Endpoints
```javascript
// Teachers Management
// GET /api/admin/teachers - Get all teachers
// POST /api/admin/teachers - Create new teacher
// PUT /api/admin/teachers/:id - Update teacher
// DELETE /api/admin/teachers/:id - Delete teacher

// Parents Management
// GET /api/admin/parents - Get all parents
// POST /api/admin/parents - Create new parent
// PUT /api/admin/parents/:id - Update parent
// DELETE /api/admin/parents/:id - Delete parent

// Classes Management
// GET /api/admin/classes - Get all classes
// POST /api/admin/classes - Create new class
// PUT /api/admin/classes/:id - Update class
// DELETE /api/admin/classes/:id - Delete class

// Subjects Management
// GET /api/admin/subjects - Get all subjects
// POST /api/admin/subjects - Create new subject
// PUT /api/admin/subjects/:id - Update subject
// DELETE /api/admin/subjects/:id - Delete subject

// System Analytics
// GET /api/admin/analytics - Get system statistics
```

### Teacher Endpoints
```javascript
// Students Management
// GET /api/teacher/students - Get students by class/section
// POST /api/teacher/students - Create new student
// PUT /api/teacher/students/:id - Update student
// DELETE /api/teacher/students/:id - Delete student

// Marks Management
// GET /api/teacher/marks - Get marks by class/subject
// POST /api/teacher/marks - Add new marks
// PUT /api/teacher/marks/:id - Update marks
// DELETE /api/teacher/marks/:id - Delete marks

// Attendance Management
// GET /api/teacher/attendance - Get attendance by date/class
// POST /api/teacher/attendance - Mark attendance
// PUT /api/teacher/attendance/:id - Update attendance

// Homework Management
// GET /api/teacher/homework - Get homework assignments
// POST /api/teacher/homework - Create homework assignment
// PUT /api/teacher/homework/:id - Update homework
// DELETE /api/teacher/homework/:id - Delete homework

// Messages
// POST /api/teacher/messages - Send message to parents
// GET /api/teacher/messages - Get sent messages
```

### Parent Endpoints
```javascript
// Student Information
// GET /api/parent/children - Get children details
// GET /api/parent/children/:id/marks - Get child's marks
// GET /api/parent/children/:id/attendance - Get child's attendance
// GET /api/parent/children/:id/homework - Get child's homework

// Messages & Notifications
// GET /api/parent/messages - Get received messages
// PUT /api/parent/messages/:id/read - Mark message as read
// GET /api/parent/notifications - Get notifications
```

### Common Endpoints
```javascript
// GET /api/classes - Get all classes
// GET /api/classes/:id/sections - Get sections by class
// GET /api/subjects - Get all subjects
```

## Installation & Setup

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.local` and update the values:
   ```bash
   cp .env.local .env.local
   ```

4. **Set up your MySQL database**
   - Create a MySQL database using the provided schema
   - Update database credentials in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment (Vercel)

1. **Prepare for deployment**
   ```bash
   npm run build
   npm run type-check
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Set environment variables in Vercel**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add environment variables from `.env.local`

### API Integration

The application is ready for API integration. Simply:

1. **Update API endpoints** in `lib/api.ts`
2. **Set production API URL** in environment variables
3. **Replace mock services** with real API calls

All CRUD operations are implemented with proper error handling and loading states.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `JWT_SECRET` | JWT secret for backend | Required |
| `MYSQL_HOST` | MySQL host | `localhost` |
| `MYSQL_USER` | MySQL username | Required |
| `MYSQL_PASSWORD` | MySQL password | Required |
| `MYSQL_DATABASE` | MySQL database name | `school_management_db` |

## Features Implemented

✅ **Authentication System**
- JWT-based login with role-based access
- Secure logout functionality
- Auto-redirect based on authentication status

✅ **Complete CRUD Operations**
- Students, Teachers, Parents, Classes, Subjects
- Create, Read, Update, Delete with confirmation dialogs
- Form validation and error handling

✅ **Role-Based Dashboards**
- Admin: System management and analytics
- Teacher: Student management and academic tools
- Parent: Child progress tracking

✅ **Academic Management**
- Marks/Grades with multiple exam types
- Attendance tracking with status indicators
- Homework assignment and submission tracking

✅ **Communication System**
- Messaging between teachers and parents
- Notifications and announcements
- Real-time updates

✅ **Reports & Analytics**
- Performance analytics
- Attendance reports
- Grade distribution

✅ **Production Ready**
- Responsive design for all devices
- Error boundaries and loading states
- SEO optimized
- Security headers
- Vercel deployment ready

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | teacher@school.com | teacher123 |
| Parent | parent@school.com | parent123 |

## License

This project is licensed under the MIT License.